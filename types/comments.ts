import { CommentsTable, CommentHistoriesTable } from '@/db/schema'

export type Comment = typeof CommentsTable.$inferSelect
export type NewComment = typeof CommentsTable.$inferInsert

export type FetchedCommentListItem = {
  id: string
  content: string
  createdAt: Date
  deletedAt: Date | null
  parentId: string | null
  authorId: string | null
  authorUsername: string | null
  authorImage: string | null
  voteSum: number
  currentUserVoteType?: number | null
}

export type FetchedPostCommentListItem = FetchedCommentListItem

export type FetchedUserCommentListItem = FetchedCommentListItem & {
  postId: string | null
  postTitle: string | null
}

export type FetchedComment = {
  id: string
  content: string
  createdAt: Date
  deletedAt: Date | null
  parentId: string | null
  postId: string | null
  postTitle: string | null
  authorId: string | null
  authorUsername: string | null
  authorImage: string | null
  voteSum: number
  currentUserVoteType?: number | null
}

export type CommentFormValues = Pick<Comment, 'content'>

export type CommentHistoryItem = typeof CommentHistoriesTable.$inferSelect
export type NewCommentHistoryItem = typeof CommentHistoriesTable.$inferInsert
