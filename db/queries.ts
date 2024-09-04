import { sql } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import {
  CommentsTable,
  BookmarksTable,
  PostVotesTable,
  CommentVotesTable,
} from '@/db/schema'

export const postCommentCountsSQ = db.$with('post_comment_counts_sq').as(
  db
    .select({
      postId: CommentsTable.postId,
      count: sql<number>`cast(count(${CommentsTable.id}) as int)`.as(
        'post_comment_count',
      ),
    })
    .from(CommentsTable)
    .groupBy(CommentsTable.postId),
)

export const postBookmarkCountsSQ = db.$with('post_bookmark_counts_sq').as(
  db
    .select({
      postId: BookmarksTable.postId,
      count: sql<number>`cast(count(${BookmarksTable.id}) as int)`.as(
        'post_bookmark_count',
      ),
    })
    .from(BookmarksTable)
    .groupBy(BookmarksTable.postId),
)

export const commentReplyCountsSQ = db.$with('comment_reply_counts_sq').as(
  db
    .select({
      parentId: CommentsTable.parentId,
      count: sql<number>`cast(count(${CommentsTable.id}) as int)`.as(
        'comment_reply_count',
      ),
    })
    .from(CommentsTable)
    .groupBy(CommentsTable.parentId),
)

export const postVoteSumsSQ = db.$with('post_vote_sums_sq').as(
  db
    .select({
      postId: PostVotesTable.postId,
      sum: sql<number>`cast(sum(${PostVotesTable.voteType}) as int)`.as(
        'post_vote_sum',
      ),
    })
    .from(PostVotesTable)
    .groupBy(PostVotesTable.postId),
)

export const commentVoteSumsSQ = db.$with('comment_vote_sums_sq').as(
  db
    .select({
      commentId: CommentVotesTable.commentId,
      sum: sql<number>`cast(sum(${CommentVotesTable.voteType}) as int)`.as(
        'comment_vote_sum',
      ),
    })
    .from(CommentVotesTable)
    .groupBy(CommentVotesTable.commentId),
)
