import {
  integer,
  smallint,
  text,
  varchar,
  timestamp,
  primaryKey,
  index,
  uniqueIndex,
  pgTable,
  AnyPgColumn,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

import { genUserId } from '@/lib/nanoid'

export const UsersTable = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => genUserId()),
    name: varchar('name', { length: 255 }),
    username: varchar('username', { length: 255 }).unique(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    emailVerified: timestamp('email_verified', { withTimezone: true }),
    image: text('image'),
    bio: text('bio'),
    score: integer('score').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }),
  },
  (users) => ({
    usernameIdx: uniqueIndex('users_username_idx').on(users.username),
    emailIdx: uniqueIndex('users_email_idx').on(users.email),
  }),
)

export const AccountsTable = pgTable(
  'accounts',
  {
    userId: varchar('user_id', { length: 255 })
      .references(() => UsersTable.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (accounts) => ({
    compoundKey: primaryKey({
      columns: [accounts.provider, accounts.providerAccountId],
    }),
  }),
)

export const VerificationTokensTable = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (verificationTokens) => ({
    compoundKey: primaryKey({
      columns: [verificationTokens.identifier, verificationTokens.token],
    }),
  }),
)

export const DeletedEmailsTable = pgTable('deleted_emails', {
  email: varchar('email', { length: 255 }).primaryKey().notNull(),
  deleteCount: integer('delete_count').default(1).notNull(),
  lastDeletedAt: timestamp('last_deleted_at', {
    withTimezone: true,
  }).notNull(),
})

export const PostsTable = pgTable(
  'posts',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    url: text('url').notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    authorId: varchar('author_id', { length: 255 }).references(
      () => UsersTable.id,
      { onDelete: 'set null' },
    ),
    score: integer('score').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }),
  },
  (posts) => ({
    scoreIdx: index('posts_score_idx').on(posts.score),
    titleIdx: index('posts_title_idx').on(posts.title),
    categoryIdx: index('posts_category_idx').on(posts.category),
    authorIdIdx: index('posts_author_id_idx').on(posts.authorId),
    createdAtIdx: index('posts_created_at_idx').on(posts.createdAt),
    deletedAtIdx: index('posts_deleted_at_idx').on(posts.deletedAt),
  }),
)

export const PostHistoriesTable = pgTable(
  'post_histories',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    url: text('url').notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    originalPostId: varchar('original_post_id', { length: 255 }).references(
      () => PostsTable.id,
      { onDelete: 'cascade' },
    ),
    authorId: varchar('author_id', { length: 255 }).references(
      () => UsersTable.id,
      { onDelete: 'set null' },
    ),
    lastEditedAt: timestamp('last_edited_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (postHistories) => ({
    originalPostIdIdx: index('post_histories_original_post_id_idx').on(
      postHistories.originalPostId,
    ),
    lastEditedAtIdx: index('post_histories_last_edited_at_idx').on(
      postHistories.lastEditedAt,
    ),
  }),
)

export const CommentsTable = pgTable(
  'comments',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    content: text('content').notNull(),
    authorId: varchar('author_id', { length: 255 }).references(
      () => UsersTable.id,
      { onDelete: 'set null' },
    ),
    postId: varchar('post_id', { length: 255 }).references(() => PostsTable.id),
    parentId: varchar('parent_id', { length: 255 }).references(
      (): AnyPgColumn => CommentsTable.id,
    ),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }),
  },
  (comments) => ({
    authorIdIdx: index('comments_author_id_idx').on(comments.authorId),
    postIdIdx: index('comments_post_id_idx').on(comments.postId),
    parentIdIdx: index('comments_parent_id_idx').on(comments.parentId),
    createdAtIdx: index('comments_created_at_idx').on(comments.createdAt),
    deletedAtIdx: index('comments_deleted_at_idx').on(comments.deletedAt),
  }),
)

export const CommentHistoriesTable = pgTable(
  'comment_histories',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    content: text('content').notNull(),
    originalCommentId: varchar('original_comment_id', {
      length: 255,
    }).references(() => CommentsTable.id, { onDelete: 'cascade' }),
    authorId: varchar('author_id', { length: 255 }).references(
      () => UsersTable.id,
      { onDelete: 'set null' },
    ),
    lastEditedAt: timestamp('last_edited_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (commentHistories) => ({
    originalCommentIdIdx: index('comment_histories_original_comment_id_idx').on(
      commentHistories.originalCommentId,
    ),
    lastEditedAtIdx: index('comment_histories_last_edited_at_idx').on(
      commentHistories.lastEditedAt,
    ),
  }),
)

export const PostVotesTable = pgTable(
  'post_votes',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    voterId: varchar('voter_id', { length: 255 })
      .references(() => UsersTable.id, { onDelete: 'cascade' })
      .notNull(),
    postId: varchar('post_id', { length: 255 }).references(() => PostsTable.id),
    voteType: smallint('vote_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (postVotes) => ({
    voterIdIdx: index('post_votes_voter_id_idx').on(postVotes.voterId),
    postIdx: index('post_votes_post_idx').on(postVotes.postId),
    voteTypeIdx: index('post_votes_vote_type_idx').on(postVotes.voteType),
    createdAtIdx: index('post_votes_created_at_idx').on(postVotes.createdAt),
  }),
)

export const CommentVotesTable = pgTable(
  'comment_votes',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    voterId: varchar('voter_id', { length: 255 })
      .references(() => UsersTable.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: varchar('comment_id', { length: 255 }).references(
      () => CommentsTable.id,
    ),
    voteType: smallint('vote_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (commentVotes) => ({
    voterIdIdx: index('comment_votes_voter_id_idx').on(commentVotes.voterId),
    commentIdx: index('comment_votes_comment_idx').on(commentVotes.commentId),
    voteTypeIdx: index('comment_votes_vote_type_idx').on(commentVotes.voteType),
    createdAtIdx: index('comment_votes_created_at_idx').on(
      commentVotes.createdAt,
    ),
  }),
)

export const BookmarksTable = pgTable(
  'bookmarks',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    bookmarkerId: varchar('bookmarker_id', { length: 255 })
      .references(() => UsersTable.id, { onDelete: 'cascade' })
      .notNull(),
    postId: varchar('post_id', { length: 255 }).references(() => PostsTable.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (bookmarks) => ({
    bookmarkerIdIdx: index('bookmarks_bookmarker_id_idx').on(
      bookmarks.bookmarkerId,
    ),
    postIdIdx: index('bookmarks_post_id_idx').on(bookmarks.postId),
    createdAtIdx: index('bookmarks_created_at_idx').on(bookmarks.createdAt),
  }),
)
