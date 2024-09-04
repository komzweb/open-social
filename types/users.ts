import { UsersTable, DeletedEmailsTable } from '@/db/schema'

export type User = typeof UsersTable.$inferSelect
export type NewUser = typeof UsersTable.$inferInsert

export type UserFormValues = Pick<User, 'name' | 'bio'>
export type FetchedUserByUsername = Omit<
  User,
  'email' | 'emailVerified' | 'lastLoginAt' | 'lastUpdatedAt'
>

export type DeletedEmailData = typeof DeletedEmailsTable.$inferSelect
