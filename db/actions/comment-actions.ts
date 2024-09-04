'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { desc, count, sum, eq, isNull, isNotNull, and, sql } from 'drizzle-orm'

import { auth } from '@/auth/auth'
import { db } from '@/db/drizzle'
import {
  UsersTable,
  PostsTable,
  CommentsTable,
  CommentHistoriesTable,
  CommentVotesTable,
} from '@/db/schema'
import { commentReplyCountsSQ, commentVoteSumsSQ } from '@/db/queries'
import { updateUserScore } from '@/db/actions/user-actions'
import { commentCreationSchema } from '@/db/validation-schemas'
import { ITEMS_PER_PAGE, ITEMS_DELETION_PENALTY_DAYS } from '@/lib/constants'
import { generalErrors, commentMessages, replyMessages } from '@/lib/messages'
import { commentCreationRateLimit } from '@/lib/rate-limits'
import { genCommentId } from '@/lib/nanoid'
import {
  calculateAgeSinceCreation,
  formatDateTime,
  parseValidationErrors,
} from '@/lib/utils'
import type { PrevState } from '@/types/common'
import type { VoteType } from '@/types/votes'

const commentVoteSum = sql<number>`coalesce(${commentVoteSumsSQ.sum}, 0)`

export async function getPostComments(
  postId: string,
  currentUserId: string | undefined,
) {
  const commentReplyCount = sql<number>`coalesce(${commentReplyCountsSQ.count}, 0)`

  const query = db
    .with(commentReplyCountsSQ, commentVoteSumsSQ)
    .select({
      id: CommentsTable.id,
      content: CommentsTable.content,
      parentId: CommentsTable.parentId,
      createdAt: CommentsTable.createdAt,
      deletedAt: CommentsTable.deletedAt,
      authorId: CommentsTable.authorId,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      replyCount: commentReplyCount,
      voteSum: commentVoteSum,
      ...(currentUserId
        ? { currentUserVoteType: CommentVotesTable.voteType }
        : {}),
    })
    .from(CommentsTable)
    .leftJoin(UsersTable, eq(CommentsTable.authorId, UsersTable.id))
    .leftJoin(
      commentReplyCountsSQ,
      eq(CommentsTable.id, commentReplyCountsSQ.parentId),
    )
    .leftJoin(
      commentVoteSumsSQ,
      eq(CommentsTable.id, commentVoteSumsSQ.commentId),
    )
    .where(eq(CommentsTable.postId, postId))
    .orderBy(
      desc(isNull(CommentsTable.deletedAt)),
      desc(isNotNull(CommentsTable.authorId)),
      desc(commentVoteSum),
      desc(commentReplyCount),
      CommentsTable.createdAt,
    )

  if (currentUserId) {
    query.leftJoin(
      CommentVotesTable,
      and(
        eq(CommentsTable.id, CommentVotesTable.commentId),
        eq(CommentVotesTable.voterId, currentUserId),
      ),
    )
  }

  return await query
}

export async function getUserComments({
  userId,
  currentUserId,
  page,
}: {
  userId: string
  currentUserId: string | undefined
  page: number
}) {
  const baseCondition = eq(CommentsTable.authorId, userId)

  let additionalCondition = undefined

  if (currentUserId !== userId) {
    additionalCondition = isNull(CommentsTable.deletedAt)
  }

  const finalCondition = additionalCondition
    ? and(baseCondition, additionalCondition)
    : baseCondition

  const query = db
    .with(commentVoteSumsSQ)
    .select({
      id: CommentsTable.id,
      content: CommentsTable.content,
      parentId: CommentsTable.parentId,
      createdAt: CommentsTable.createdAt,
      deletedAt: CommentsTable.deletedAt,
      authorId: CommentsTable.authorId,
      postId: CommentsTable.postId,
      postTitle: PostsTable.title,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      voteSum: commentVoteSum,
      ...(currentUserId
        ? { currentUserVoteType: CommentVotesTable.voteType }
        : {}),
    })
    .from(CommentsTable)
    .innerJoin(PostsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(UsersTable, eq(CommentsTable.authorId, UsersTable.id))
    .leftJoin(
      commentVoteSumsSQ,
      eq(CommentsTable.id, commentVoteSumsSQ.commentId),
    )
    .where(finalCondition)
    .orderBy(desc(CommentsTable.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)

  if (currentUserId) {
    query.leftJoin(
      CommentVotesTable,
      and(
        eq(CommentsTable.id, CommentVotesTable.commentId),
        eq(CommentVotesTable.voterId, currentUserId),
      ),
    )
  }

  return await query
}

export async function getUserVotedComments({
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

  const baseCondition = eq(CommentVotesTable.voterId, userId)

  let additionalCondition = undefined

  if (voteType) {
    additionalCondition = eq(CommentVotesTable.voteType, voteType)
  }

  const finalCondition = additionalCondition
    ? and(baseCondition, additionalCondition)
    : baseCondition

  const query = db
    .with(commentVoteSumsSQ)
    .select({
      id: CommentsTable.id,
      content: CommentsTable.content,
      parentId: CommentsTable.parentId,
      createdAt: CommentsTable.createdAt,
      deletedAt: CommentsTable.deletedAt,
      authorId: CommentsTable.authorId,
      postId: CommentsTable.postId,
      postTitle: PostsTable.title,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      voteSum: commentVoteSum,
      currentUserVoteType: CommentVotesTable.voteType,
    })
    .from(CommentVotesTable)
    .innerJoin(CommentsTable, eq(CommentVotesTable.commentId, CommentsTable.id))
    .innerJoin(PostsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(UsersTable, eq(CommentsTable.authorId, UsersTable.id))
    .leftJoin(
      commentVoteSumsSQ,
      eq(CommentsTable.id, commentVoteSumsSQ.commentId),
    )
    .where(finalCondition)
    .orderBy(desc(CommentsTable.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE)

  return await query
}

export async function getComment(
  commentId: string,
  currentUserId: string | undefined,
) {
  const query = db
    .with(commentVoteSumsSQ)
    .select({
      id: CommentsTable.id,
      content: CommentsTable.content,
      parentId: CommentsTable.parentId,
      createdAt: CommentsTable.createdAt,
      deletedAt: CommentsTable.deletedAt,
      authorId: CommentsTable.authorId,
      postId: CommentsTable.postId,
      postTitle: PostsTable.title,
      authorUsername: UsersTable.username,
      authorImage: UsersTable.image,
      voteSum: commentVoteSum,
      ...(currentUserId
        ? { currentUserVoteType: CommentVotesTable.voteType }
        : {}),
    })
    .from(CommentsTable)
    .innerJoin(PostsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(UsersTable, eq(CommentsTable.authorId, UsersTable.id))
    .leftJoin(
      commentVoteSumsSQ,
      eq(CommentsTable.id, commentVoteSumsSQ.commentId),
    )
    .where(eq(CommentsTable.id, commentId))

  if (currentUserId) {
    query.leftJoin(
      CommentVotesTable,
      and(
        eq(CommentsTable.id, CommentVotesTable.commentId),
        eq(CommentVotesTable.voterId, currentUserId),
      ),
    )
  }

  return (await query)[0]
}

export async function getCommentMetadata(commentId: string) {
  return (
    await db
      .select({
        content: CommentsTable.content,
        postTitle: PostsTable.title,
        authorUsername: UsersTable.username,
      })
      .from(CommentsTable)
      .innerJoin(PostsTable, eq(CommentsTable.postId, PostsTable.id))
      .leftJoin(UsersTable, eq(CommentsTable.authorId, UsersTable.id))
      .where(eq(CommentsTable.id, commentId))
  )[0]
}

export async function getCommentHistory(commentId: string) {
  return await db
    .select()
    .from(CommentHistoriesTable)
    .where(eq(CommentHistoriesTable.originalCommentId, commentId))
    .orderBy(desc(CommentHistoriesTable.lastEditedAt))
}

export async function createComment(
  postId: string,
  parentId: string | null,
  isTargetDeleted: boolean,
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  if (isTargetDeleted) {
    return {
      success: false,
      message: parentId
        ? replyMessages.create.errors.targetCommentAlreadyDeleted
        : commentMessages.create.errors.targetPostAlreadyDeleted,
    }
  }

  const currentUserId = session.user.id

  const { success } = await commentCreationRateLimit.limit(currentUserId)

  if (!success) {
    return {
      success: false,
      message: parentId
        ? replyMessages.create.errors.rateLimit
        : commentMessages.create.errors.rateLimit,
    }
  }

  const parsedComment = commentCreationSchema.safeParse({
    content: formData.get('content'),
  })

  if (!parsedComment.success) {
    const validationErrors = parseValidationErrors(parsedComment.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  const commentId = genCommentId()

  try {
    await db.insert(CommentsTable).values({
      ...parsedComment.data,
      id: commentId,
      authorId: currentUserId,
      postId,
      parentId,
    })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: parentId
        ? replyMessages.create.errors.genericError
        : commentMessages.create.errors.genericError,
    }
  }

  if (parentId) {
    redirect(`/p/${postId}?rc=success`)
  } else {
    revalidatePath('/p/[postId]', 'page')

    return {
      success: true,
      message: commentMessages.create.success,
    }
  }
}

export async function updateComment(
  originalCommentId: string,
  currentContent: string,
  authorId: string,
  postId: string,
  hasParent: boolean,
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
      message: hasParent
        ? replyMessages.update.errors.replyAlreadyDeleted
        : commentMessages.update.errors.commentAlreadyDeleted,
    }
  }

  if (isEditLimit) {
    return {
      success: false,
      message: hasParent
        ? replyMessages.update.errors.editLimit
        : commentMessages.update.errors.editLimit,
    }
  }

  const parsedComment = commentCreationSchema.safeParse({
    content: formData.get('content'),
  })

  if (!parsedComment.success) {
    const validationErrors = parseValidationErrors(parsedComment.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  if (currentContent === parsedComment.data.content) {
    return {
      success: true,
    }
  }

  const date = new Date()
  const formattedDateTime = formatDateTime(date)

  try {
    const newCommentHistoryItem = (
      await db
        .insert(CommentHistoriesTable)
        .values({
          id: originalCommentId + '_hist_' + formattedDateTime,
          content: currentContent,
          originalCommentId: originalCommentId,
          authorId: authorId,
          lastEditedAt: date,
        })
        .returning()
    )[0]

    await db
      .update(CommentsTable)
      .set({
        ...parsedComment.data,
        lastUpdatedAt: newCommentHistoryItem.lastEditedAt,
      })
      .where(eq(CommentsTable.id, originalCommentId))
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: hasParent
        ? replyMessages.update.errors.genericError
        : commentMessages.update.errors.genericError,
    }
  }

  revalidatePath('/p/[postId]', 'page')

  return {
    success: true,
    message: hasParent
      ? replyMessages.update.success
      : commentMessages.update.success,
  }
}

async function getCommentReplyCount(commentId: string) {
  return (
    await db
      .select({ count: count() })
      .from(CommentsTable)
      .where(eq(CommentsTable.parentId, commentId))
  )[0].count
}

async function getCommentVoteSum(commentId: string): Promise<number | null> {
  return (
    await db
      .select({
        sum: sum(CommentVotesTable.voteType).mapWith(Number),
      })
      .from(CommentVotesTable)
      .where(eq(CommentVotesTable.commentId, commentId))
  )[0].sum
}

export async function deleteComment(
  commentId: string,
  authorId: string,
  postId: string,
  createdAt: Date,
  hasParent: boolean,
  isDeleted: boolean,
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
      message: hasParent
        ? replyMessages.delete.errors.replyAlreadyDeleted
        : commentMessages.delete.errors.commentAlreadyDeleted,
    }
  }

  let commentReplyCount: number
  let rawCommentVoteSum: number | null

  try {
    commentReplyCount = await getCommentReplyCount(commentId)
    rawCommentVoteSum = await getCommentVoteSum(commentId)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  const commentVoteSum = rawCommentVoteSum ?? 0

  const daysSinceCreation = calculateAgeSinceCreation(createdAt, 'days')

  try {
    if (commentReplyCount > 0 || rawCommentVoteSum !== null) {
      await db
        .update(CommentsTable)
        .set({ deletedAt: new Date() })
        .where(eq(CommentsTable.id, commentId))
    } else {
      await db.delete(CommentsTable).where(eq(CommentsTable.id, commentId))
    }

    if (
      daysSinceCreation <= ITEMS_DELETION_PENALTY_DAYS &&
      commentVoteSum > 0
    ) {
      await updateUserScore(authorId, -commentVoteSum)
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: hasParent
        ? replyMessages.delete.errors.genericError
        : commentMessages.delete.errors.genericError,
    }
  }

  if (hasParent) {
    redirect(`/p/${postId}?rd=success`)
  } else {
    redirect(`/p/${postId}?cd=success`)
  }
}
