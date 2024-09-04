'use server'

import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'

import { auth } from '@/auth/auth'
import { db } from '@/db/drizzle'
import {
  PostsTable,
  CommentsTable,
  PostVotesTable,
  CommentVotesTable,
} from '@/db/schema'
import { getUserById, updateUserScore } from '@/db/actions/user-actions'
import { DAYS_AS_NEW_USER, MIN_SCORE_FOR_REGULAR_USER } from '@/lib/constants'
import { generalErrors, voteMessages } from '@/lib/messages'
import { voteRateLimit } from '@/lib/rate-limits'
import { genVoteId } from '@/lib/nanoid'
import type { PrevState } from '@/types/common'
import type { VoteType } from '@/types/votes'

export async function createPostVote(
  postId: string,
  voteType: VoteType,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  if (voteType === -1) {
    const currentUser = await getUserById(currentUserId)

    const daysSinceJoined = Math.floor(
      (Date.now() - currentUser.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (
      currentUser.score < MIN_SCORE_FOR_REGULAR_USER ||
      daysSinceJoined < DAYS_AS_NEW_USER
    ) {
      return {
        success: false,
        message: voteMessages.create.errors.downvoteNotAllowed,
      }
    }
  }

  const { success } = await voteRateLimit.limit(currentUserId)

  if (!success) {
    return {
      success: false,
      message: voteMessages.create.errors.rateLimit,
    }
  }

  let post

  try {
    post = (
      await db
        .select({
          deletedAt: PostsTable.deletedAt,
          authorId: PostsTable.authorId,
          userVote: PostVotesTable.voteType,
        })
        .from(PostsTable)
        .where(eq(PostsTable.id, postId))
        .leftJoin(
          PostVotesTable,
          and(
            eq(PostsTable.id, PostVotesTable.postId),
            eq(PostVotesTable.voterId, currentUserId),
          ),
        )
        .groupBy(PostsTable.id, PostVotesTable.voteType)
    )[0]
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  if (!post) {
    return {
      success: false,
      message: voteMessages.create.errors.postNotFound,
    }
  }

  if (post.deletedAt) {
    return {
      success: false,
      message: voteMessages.create.errors.deletedItem,
    }
  }

  if (!post.authorId) {
    return {
      success: false,
      message: voteMessages.create.errors.deletedItemUser,
    }
  }

  if (post.authorId === currentUserId) {
    return {
      success: false,
      message: voteMessages.create.errors.notAllowed,
    }
  }

  if (post.userVote) {
    return {
      success: false,
      message: voteMessages.create.errors.alreadyVoted,
    }
  }

  const voteId = genVoteId()

  try {
    await db
      .insert(PostVotesTable)
      .values({ id: voteId, voterId: currentUserId, postId, voteType })

    await updateUserScore(post.authorId, voteType)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: voteMessages.create.errors.genericError,
    }
  }

  redirect(redirectPath)
}

export async function createCommentVote(
  commentId: string,
  voteType: VoteType,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  if (voteType === -1) {
    const currentUser = await getUserById(currentUserId)

    const daysSinceJoined = Math.floor(
      (Date.now() - currentUser.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (
      currentUser.score < MIN_SCORE_FOR_REGULAR_USER ||
      daysSinceJoined < DAYS_AS_NEW_USER
    ) {
      return {
        success: false,
        message: voteMessages.create.errors.downvoteNotAllowed,
      }
    }
  }

  const { success } = await voteRateLimit.limit(currentUserId)

  if (!success) {
    return {
      success: false,
      message: voteMessages.create.errors.rateLimit,
    }
  }

  let comment

  try {
    comment = (
      await db
        .select({
          deletedAt: CommentsTable.deletedAt,
          authorId: CommentsTable.authorId,
          userVote: CommentVotesTable.voteType,
        })
        .from(CommentsTable)
        .where(eq(CommentsTable.id, commentId))
        .leftJoin(
          CommentVotesTable,
          and(
            eq(CommentsTable.id, CommentVotesTable.commentId),
            eq(CommentVotesTable.voterId, currentUserId),
          ),
        )
        .groupBy(CommentsTable.id, CommentVotesTable.voteType)
    )[0]
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  if (!comment) {
    return {
      success: false,
      message: voteMessages.create.errors.commentNotFound,
    }
  }

  if (comment.deletedAt) {
    return {
      success: false,
      message: voteMessages.create.errors.deletedItem,
    }
  }

  if (!comment.authorId) {
    return {
      success: false,
      message: voteMessages.create.errors.deletedItemUser,
    }
  }

  if (comment.authorId === currentUserId) {
    return {
      success: false,
      message: voteMessages.create.errors.notAllowed,
    }
  }

  if (comment.userVote) {
    return {
      success: false,
      message: voteMessages.create.errors.alreadyVoted,
    }
  }

  const voteId = genVoteId()

  try {
    await db
      .insert(CommentVotesTable)
      .values({ id: voteId, voterId: currentUserId, commentId, voteType })

    await updateUserScore(comment.authorId, voteType)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: voteMessages.create.errors.genericError,
    }
  }

  redirect(redirectPath)
}

export async function deletePostVote(
  postId: string,
  voteType: VoteType,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  let postAuthorId

  try {
    postAuthorId = (
      await db
        .select({ authorId: PostsTable.authorId })
        .from(PostsTable)
        .where(eq(PostsTable.id, postId))
    )[0]?.authorId
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  try {
    await db
      .delete(PostVotesTable)
      .where(
        and(
          eq(PostVotesTable.postId, postId),
          eq(PostVotesTable.voterId, currentUserId),
        ),
      )

    if (postAuthorId) {
      await updateUserScore(postAuthorId, -voteType)
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: voteMessages.delete.error,
    }
  }

  redirect(redirectPath)
}

export async function deleteCommentVote(
  commentId: string,
  voteType: VoteType,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  let commentAuthorId

  try {
    commentAuthorId = (
      await db
        .select({ authorId: CommentsTable.authorId })
        .from(CommentsTable)
        .where(eq(CommentsTable.id, commentId))
    )[0]?.authorId
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  try {
    await db
      .delete(CommentVotesTable)
      .where(
        and(
          eq(CommentVotesTable.commentId, commentId),
          eq(CommentVotesTable.voterId, currentUserId),
        ),
      )

    if (commentAuthorId) {
      await updateUserScore(commentAuthorId, -voteType)
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: voteMessages.delete.error,
    }
  }

  redirect(redirectPath)
}
