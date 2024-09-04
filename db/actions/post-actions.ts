'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  desc,
  count,
  sum,
  eq,
  isNull,
  isNotNull,
  ilike,
  and,
  sql,
  type SQL,
} from 'drizzle-orm'

import { auth } from '@/auth/auth'
import { db } from '@/db/drizzle'
import {
  UsersTable,
  PostsTable,
  PostHistoriesTable,
  CommentsTable,
  PostVotesTable,
  BookmarksTable,
} from '@/db/schema'
import {
  postCommentCountsSQ,
  postBookmarkCountsSQ,
  postVoteSumsSQ,
} from '@/db/queries'
import { updateUserScore } from '@/db/actions/user-actions'
import { postCreationSchema } from '@/db/validation-schemas'
import {
  ITEMS_PER_PAGE,
  POSTS_TITLE_EDIT_TIME_LIMIT_HOURS,
  ITEMS_DELETION_PENALTY_DAYS,
} from '@/lib/constants'
import { generalErrors, postMessages } from '@/lib/messages'
import { postCreationRateLimit } from '@/lib/rate-limits'
import { genPostId } from '@/lib/nanoid'
import {
  calculateAgeSinceCreation,
  formatDateTime,
  parseValidationErrors,
} from '@/lib/utils'
import type { PrevState } from '@/types/common'
import type { VoteType } from '@/types/votes'

const postCommentCount = sql<number>`coalesce(${postCommentCountsSQ.count}, 0)`
const postBookmarkCount = sql<number>`coalesce(${postBookmarkCountsSQ.count}, 0)`
const postVoteSum = sql<number>`coalesce(${postVoteSumsSQ.sum}, 0)`

export async function getPosts({
  currentUserId,
  page,
  sort,
  cat,
  search,
}: {
  currentUserId: string | undefined
  page: number
  sort: 'score' | 'newest'
  cat: 'all' | 'general' | 'ask' | 'show'
  search: string
}) {
  const baseQuery = db
    .with(postCommentCountsSQ, postBookmarkCountsSQ, postVoteSumsSQ)
    .select({
      id: PostsTable.id,
      title: PostsTable.title,
      score: PostsTable.score,
      category: PostsTable.category,
      createdAt: PostsTable.createdAt,
      deletedAt: PostsTable.deletedAt,
      authorId: PostsTable.authorId,
      commentCount: postCommentCount.as('comment_count'),
      voteSum: postVoteSum.as('vote_sum'),
      ...(currentUserId
        ? { currentUserVoteType: PostVotesTable.voteType }
        : {}),
      ...(currentUserId
        ? { currentBookmarkerId: BookmarksTable.bookmarkerId }
        : {}),
    })
    .from(PostsTable)
    .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
    .leftJoin(
      postCommentCountsSQ,
      eq(PostsTable.id, postCommentCountsSQ.postId),
    )
    .leftJoin(
      postBookmarkCountsSQ,
      eq(PostsTable.id, postBookmarkCountsSQ.postId),
    )
    .leftJoin(postVoteSumsSQ, eq(PostsTable.id, postVoteSumsSQ.postId))

  if (currentUserId) {
    baseQuery
      .leftJoin(
        PostVotesTable,
        and(
          eq(PostsTable.id, PostVotesTable.postId),
          eq(PostVotesTable.voterId, currentUserId),
        ),
      )
      .leftJoin(
        BookmarksTable,
        and(
          eq(PostsTable.id, BookmarksTable.postId),
          eq(BookmarksTable.bookmarkerId, currentUserId),
        ),
      )
  }

  if (search) {
    const searchWords = search.split(/\s+/).filter((word) => word.length > 0)
    const searchConditions = searchWords.map((word) =>
      ilike(PostsTable.title, `%${word}%`),
    )

    baseQuery.where(
      and(
        cat === 'all' ? undefined : eq(PostsTable.category, cat),
        and(...searchConditions),
      ),
    )
  } else {
    baseQuery.where(cat === 'all' ? undefined : eq(PostsTable.category, cat))
  }

  const finalQuery = baseQuery.as('final_query')

  let orderByColumns: Array<SQL> = []

  if (sort === 'score') {
    orderByColumns = [desc(finalQuery.score), desc(finalQuery.createdAt)]
  } else if (sort === 'newest') {
    orderByColumns = [desc(finalQuery.createdAt)]
  }

  return await db
    .select()
    .from(finalQuery)
    .orderBy(
      desc(isNull(finalQuery.deletedAt)),
      desc(isNotNull(finalQuery.authorId)),
      ...orderByColumns,
    )
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)
}

export async function getUserPosts({
  currentUserId,
  filterUserId,
  page,
}: {
  currentUserId: string | undefined
  filterUserId: string
  page: number
}) {
  const baseCondition = eq(PostsTable.authorId, filterUserId)

  let additionalCondition = undefined

  if (currentUserId !== filterUserId) {
    additionalCondition = isNull(PostsTable.deletedAt)
  }

  const finalCondition = additionalCondition
    ? and(baseCondition, additionalCondition)
    : baseCondition

  const query = db
    .with(postCommentCountsSQ, postBookmarkCountsSQ, postVoteSumsSQ)
    .select({
      id: PostsTable.id,
      title: PostsTable.title,
      category: PostsTable.category,
      createdAt: PostsTable.createdAt,
      deletedAt: PostsTable.deletedAt,
      authorId: PostsTable.authorId,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      commentCount: postCommentCount,
      voteSum: postVoteSum,
      ...(currentUserId
        ? { currentUserVoteType: PostVotesTable.voteType }
        : {}),
      ...(currentUserId
        ? { currentBookmarkerId: BookmarksTable.bookmarkerId }
        : {}),
    })
    .from(PostsTable)
    .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
    .leftJoin(
      postCommentCountsSQ,
      eq(PostsTable.id, postCommentCountsSQ.postId),
    )
    .leftJoin(
      postBookmarkCountsSQ,
      eq(PostsTable.id, postBookmarkCountsSQ.postId),
    )
    .leftJoin(postVoteSumsSQ, eq(PostsTable.id, postVoteSumsSQ.postId))
    .where(finalCondition)
    .orderBy(desc(PostsTable.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)

  if (currentUserId) {
    query
      .leftJoin(
        PostVotesTable,
        and(
          eq(PostsTable.id, PostVotesTable.postId),
          eq(PostVotesTable.voterId, currentUserId),
        ),
      )
      .leftJoin(
        BookmarksTable,
        and(
          eq(PostsTable.id, BookmarksTable.postId),
          eq(BookmarksTable.bookmarkerId, currentUserId),
        ),
      )
  }

  return await query
}

export async function getUserVotedPosts({
  userId,
  currentUserId,
  voteType,
  page,
}: {
  userId: string
  currentUserId: string
  page: number
  voteType?: VoteType
}) {
  if (userId !== currentUserId) {
    throw new Error('Unauthorized access')
  }

  const baseCondition = eq(PostVotesTable.voterId, currentUserId)

  let additionalCondition = undefined

  if (voteType) {
    additionalCondition = eq(PostVotesTable.voteType, voteType)
  }

  const finalCondition = additionalCondition
    ? and(baseCondition, additionalCondition)
    : baseCondition

  const query = db
    .with(postCommentCountsSQ, postVoteSumsSQ)
    .select({
      id: PostsTable.id,
      title: PostsTable.title,
      category: PostsTable.category,
      createdAt: PostsTable.createdAt,
      deletedAt: PostsTable.deletedAt,
      authorId: PostsTable.authorId,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      commentCount: postCommentCount,
      voteSum: postVoteSum,
      currentUserVoteType: PostVotesTable.voteType,
      currentBookmarkerId: BookmarksTable.bookmarkerId,
    })
    .from(PostVotesTable)
    .innerJoin(PostsTable, eq(PostVotesTable.postId, PostsTable.id))
    .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
    .leftJoin(
      postCommentCountsSQ,
      eq(PostsTable.id, postCommentCountsSQ.postId),
    )
    .leftJoin(postVoteSumsSQ, eq(PostsTable.id, postVoteSumsSQ.postId))
    .leftJoin(
      BookmarksTable,
      and(
        eq(PostsTable.id, BookmarksTable.postId),
        eq(BookmarksTable.bookmarkerId, currentUserId),
      ),
    )
    .where(finalCondition)
    .orderBy(desc(PostsTable.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)

  return await query
}

export async function getUserBookmarkedPosts({
  userId,
  currentUserId,
  page,
}: {
  userId: string
  currentUserId: string
  page: number
}) {
  if (userId !== currentUserId) {
    throw new Error('Unauthorized access')
  }

  const query = db
    .with(postCommentCountsSQ, postVoteSumsSQ)
    .select({
      id: PostsTable.id,
      title: PostsTable.title,
      category: PostsTable.category,
      createdAt: PostsTable.createdAt,
      deletedAt: PostsTable.deletedAt,
      authorId: PostsTable.authorId,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      commentCount: postCommentCount,
      voteSum: postVoteSum,
      currentUserVoteType: PostVotesTable.voteType,
      currentBookmarkerId: BookmarksTable.bookmarkerId,
    })
    .from(BookmarksTable)
    .innerJoin(PostsTable, eq(BookmarksTable.postId, PostsTable.id))
    .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
    .leftJoin(
      postCommentCountsSQ,
      eq(PostsTable.id, postCommentCountsSQ.postId),
    )
    .leftJoin(postVoteSumsSQ, eq(PostsTable.id, postVoteSumsSQ.postId))
    .leftJoin(
      PostVotesTable,
      and(
        eq(PostsTable.id, PostVotesTable.postId),
        eq(PostVotesTable.voterId, currentUserId),
      ),
    )
    .where(
      and(
        eq(PostsTable.id, BookmarksTable.postId),
        eq(BookmarksTable.bookmarkerId, currentUserId),
      ),
    )
    .orderBy(desc(PostsTable.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)

  return await query
}

export async function getPost(
  postId: string,
  currentUserId: string | undefined,
) {
  const query = db
    .with(postCommentCountsSQ, postVoteSumsSQ, postBookmarkCountsSQ)
    .select({
      title: PostsTable.title,
      url: PostsTable.url,
      content: PostsTable.content,
      category: PostsTable.category,
      createdAt: PostsTable.createdAt,
      deletedAt: PostsTable.deletedAt,
      authorId: PostsTable.authorId,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      commentCount: postCommentCount,
      bookmarkCount: postBookmarkCount,
      voteSum: postVoteSum,
      ...(currentUserId
        ? { currentUserVoteType: PostVotesTable.voteType }
        : {}),
      ...(currentUserId
        ? { currentBookmarkerId: BookmarksTable.bookmarkerId }
        : {}),
    })
    .from(PostsTable)
    .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
    .leftJoin(
      postCommentCountsSQ,
      eq(PostsTable.id, postCommentCountsSQ.postId),
    )
    .leftJoin(postVoteSumsSQ, eq(PostsTable.id, postVoteSumsSQ.postId))
    .leftJoin(
      postBookmarkCountsSQ,
      eq(PostsTable.id, postBookmarkCountsSQ.postId),
    )
    .where(eq(PostsTable.id, postId))

  if (currentUserId) {
    query
      .leftJoin(
        PostVotesTable,
        and(
          eq(PostsTable.id, PostVotesTable.postId),
          eq(PostVotesTable.voterId, currentUserId),
        ),
      )
      .leftJoin(
        BookmarksTable,
        and(
          eq(PostsTable.id, BookmarksTable.postId),
          eq(BookmarksTable.bookmarkerId, currentUserId),
        ),
      )
  }

  return (await query)[0]
}

export async function getPostMetadata(postId: string) {
  return (
    await db
      .select({
        title: PostsTable.title,
        authorUsername: UsersTable.username,
      })
      .from(PostsTable)
      .leftJoin(UsersTable, eq(PostsTable.authorId, UsersTable.id))
      .where(eq(PostsTable.id, postId))
  )[0]
}

export async function getPostHistory(postId: string) {
  return await db
    .select()
    .from(PostHistoriesTable)
    .where(eq(PostHistoriesTable.originalPostId, postId))
    .orderBy(desc(PostHistoriesTable.lastEditedAt))
}

export async function createPost(
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  const { success } = await postCreationRateLimit.limit(currentUserId)

  if (!success) {
    return {
      success: false,
      message: postMessages.create.errors.rateLimit,
    }
  }

  const parsedPost = postCreationSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    content: formData.get('content'),
    category: formData.get('category'),
  })

  if (!parsedPost.success) {
    const validationErrors = parseValidationErrors(parsedPost.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  const postId = genPostId()

  try {
    await db
      .insert(PostsTable)
      .values({ ...parsedPost.data, id: postId, authorId: currentUserId })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: postMessages.create.errors.genericError,
    }
  }

  redirect(`/p/${postId}?pc=success`)
}

export async function updatePost(
  originalPostId: string,
  currentTitle: string,
  currentUrl: string,
  currentContent: string,
  currentCategory: string,
  authorId: string,
  createdAt: Date,
  isDeleted: boolean,
  isEditLimit: boolean,
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== authorId)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  if (isDeleted) {
    return {
      success: false,
      message: postMessages.update.errors.postAlreadyDeleted,
    }
  }

  if (isEditLimit) {
    return {
      success: false,
      message: postMessages.update.errors.editLimit,
    }
  }

  const hoursSinceCreation = calculateAgeSinceCreation(createdAt, 'hours')

  const extendedPostCreationSchema = postCreationSchema.extend({
    title: postCreationSchema.shape.title.refine(
      (title) =>
        hoursSinceCreation <= POSTS_TITLE_EDIT_TIME_LIMIT_HOURS ||
        title === currentTitle,
      {
        message: postMessages.update.fieldErrors.title.timeLimit,
      },
    ),
  })

  const parsedPost = extendedPostCreationSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    content: formData.get('content'),
    category: formData.get('category'),
  })

  if (!parsedPost.success) {
    const validationErrors = parseValidationErrors(parsedPost.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  if (
    currentTitle === parsedPost.data.title &&
    currentUrl === parsedPost.data.url &&
    currentContent === parsedPost.data.content &&
    currentCategory === parsedPost.data.category
  ) {
    return {
      success: true,
    }
  }

  const date = new Date()
  const formattedDateTime = formatDateTime(date)

  try {
    const newPostHistoryItem = (
      await db
        .insert(PostHistoriesTable)
        .values({
          id: originalPostId + '_hist_' + formattedDateTime,
          title: currentTitle,
          url: currentUrl,
          content: currentContent,
          category: currentCategory,
          originalPostId: originalPostId,
          authorId: authorId,
          lastEditedAt: date,
        })
        .returning()
    )[0]

    await db
      .update(PostsTable)
      .set({
        ...parsedPost.data,
        lastUpdatedAt: newPostHistoryItem.lastEditedAt,
      })
      .where(eq(PostsTable.id, originalPostId))
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: postMessages.update.errors.genericError,
    }
  }

  revalidatePath('/p/[postId]', 'page')

  return {
    success: true,
    message: postMessages.update.success,
  }
}

async function getPostCommentCount(postId: string) {
  return (
    await db
      .select({ count: count() })
      .from(CommentsTable)
      .where(eq(CommentsTable.postId, postId))
  )[0].count
}

async function getPostBookmarkCount(postId: string) {
  return (
    await db
      .select({ count: count() })
      .from(BookmarksTable)
      .where(eq(BookmarksTable.postId, postId))
  )[0].count
}

async function getPostVoteSum(postId: string): Promise<number | null> {
  return (
    await db
      .select({
        sum: sum(PostVotesTable.voteType).mapWith(Number),
      })
      .from(PostVotesTable)
      .where(eq(PostVotesTable.postId, postId))
  )[0].sum
}

export async function deletePost(
  postId: string,
  authorId: string,
  createdAt: Date,
  isDeleted: boolean,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== authorId)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  if (isDeleted) {
    return {
      success: false,
      message: postMessages.delete.errors.postAlreadyDeleted,
    }
  }

  let postCommentCount: number
  let postBookmarkCount: number
  let rawPostVoteSum: number | null

  try {
    postCommentCount = await getPostCommentCount(postId)
    postBookmarkCount = await getPostBookmarkCount(postId)
    rawPostVoteSum = await getPostVoteSum(postId)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  const postVoteSum = rawPostVoteSum ?? 0

  const daysSinceCreation = calculateAgeSinceCreation(createdAt, 'days')

  try {
    if (
      postCommentCount > 0 ||
      postBookmarkCount > 0 ||
      rawPostVoteSum !== null
    ) {
      await db
        .update(PostsTable)
        .set({ deletedAt: new Date() })
        .where(eq(PostsTable.id, postId))
    } else {
      await db.delete(PostsTable).where(eq(PostsTable.id, postId))
    }

    if (daysSinceCreation <= ITEMS_DELETION_PENALTY_DAYS && postVoteSum > 0) {
      await updateUserScore(authorId, -postVoteSum)
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: postMessages.delete.errors.genericError,
    }
  }

  if (
    postCommentCount > 0 ||
    postBookmarkCount > 0 ||
    rawPostVoteSum !== null
  ) {
    redirect(`/p/${postId}?pd=success`)
  } else {
    redirect('/?pd=success')
  }
}
