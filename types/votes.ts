import { PostVotesTable, CommentVotesTable } from '@/db/schema'

export type VoteType = 1 | -1

export type PostVote = typeof PostVotesTable.$inferSelect
export type NewPostVote = typeof PostVotesTable.$inferInsert

export type CommentVote = typeof CommentVotesTable.$inferSelect
export type NewCommentVote = typeof CommentVotesTable.$inferInsert
