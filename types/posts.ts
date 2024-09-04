import { PostsTable, PostHistoriesTable } from '@/db/schema'

export type Post = typeof PostsTable.$inferSelect
export type NewPost = typeof PostsTable.$inferInsert

export type FetchedPostListItem = {
  id: string
  title: string
  category: string
  createdAt: Date
  deletedAt: Date | null
  authorId: string | null
  commentCount: number
  voteSum: number
  currentUserVoteType?: number | null
  currentBookmarkerId?: string | null
}

export type FetchedPost = {
  title: string
  url: string
  content: string
  category: string
  createdAt: Date
  deletedAt: Date | null
  authorId: string | null
  authorUsername: string | null
  authorImage: string | null
  commentCount: number
  voteSum: number
  bookmarkCount: number
  currentUserVoteType?: number | null
  currentBookmarkerId?: string | null
}

export type PostFormValues = Pick<
  Post,
  'title' | 'url' | 'content' | 'category'
>

export type PostHistoryItem = typeof PostHistoriesTable.$inferSelect
export type NewPostHistoryItem = typeof PostHistoriesTable.$inferInsert
