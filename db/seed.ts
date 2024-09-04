import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

import { UsersTable, PostsTable, CommentsTable } from '@/db/schema'
import { newUsers, newPosts, newComments } from '@/db/seed-data'
import type { User, Post, Comment } from '@/types'

import '@/env-config'

async function seed() {
  const queryClient = postgres(process.env.DB_URL!)
  const db = drizzle(queryClient)

  const insertedUsers: Pick<User, 'id'>[] = await db
    .insert(UsersTable)
    .values(newUsers)
    .returning({ id: UsersTable.id })

  console.log(`Seeded ${insertedUsers.length} users`)

  const insertedPosts: Pick<Post, 'id'>[] = await db
    .insert(PostsTable)
    .values(newPosts)
    .returning({ id: PostsTable.id })

  console.log(`Seeded ${insertedPosts.length} posts`)

  const insertedParentComments: Pick<Comment, 'id'>[] = await db
    .insert(CommentsTable)
    .values(newComments)
    .returning({ id: CommentsTable.id })

  console.log(`Seeded ${insertedParentComments.length} comments`)

  await queryClient.end()
}

seed()
