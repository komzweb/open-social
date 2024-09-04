import type { NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import {
  PostsTable,
  CommentsTable,
  BookmarksTable,
  PostVotesTable,
} from '@/db/schema'
import {
  POSTS_SCORE_DECAY_INTERVAL_DAYS,
  POSTS_SCORE_DECAY_RATE,
} from '@/lib/constants'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !cronSecret) {
    return new Response('Cron secret not set', {
      status: 500,
    })
  }

  if (isProd && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const decayIntervalInSeconds = POSTS_SCORE_DECAY_INTERVAL_DAYS * 86400

  const query = sql`
  WITH comment_counts AS (
    SELECT ${CommentsTable.postId} AS post_id, COUNT(*) AS comment_count
    FROM ${CommentsTable}
    GROUP BY ${CommentsTable.postId}
  ),
  bookmark_counts AS (
    SELECT ${BookmarksTable.postId} AS post_id, COUNT(*) AS bookmark_count
    FROM ${BookmarksTable}
    GROUP BY ${BookmarksTable.postId}
  ),
  vote_sums AS (
    SELECT ${PostVotesTable.postId} AS post_id, SUM(${PostVotesTable.voteType}) AS vote_sum
    FROM ${PostVotesTable}
    GROUP BY ${PostVotesTable.postId}
  ),
  post_stats AS (
    SELECT
      ${PostsTable.id} AS id,
      COALESCE(comment_counts.comment_count, 0) AS comment_count,
      COALESCE(bookmark_counts.bookmark_count, 0) AS bookmark_count,
      COALESCE(vote_sums.vote_sum, 0) AS vote_sum
    FROM ${PostsTable}
    LEFT JOIN comment_counts ON ${PostsTable.id} = comment_counts.post_id
    LEFT JOIN bookmark_counts ON ${PostsTable.id} = bookmark_counts.post_id
    LEFT JOIN vote_sums ON ${PostsTable.id} = vote_sums.post_id
  )
  UPDATE ${PostsTable}
  SET score = GREATEST(
    (COALESCE(post_stats.vote_sum, 0) + COALESCE(post_stats.bookmark_count, 0) + COALESCE(post_stats.comment_count, 0))
    - EXTRACT(EPOCH FROM AGE(NOW(), ${PostsTable.createdAt})) / ${decayIntervalInSeconds} * ${POSTS_SCORE_DECAY_RATE},
    0
  )::int
  FROM post_stats
  WHERE ${PostsTable.id} = post_stats.id
`

  try {
    await db.execute(query)
  } catch (error) {
    if (error instanceof Error) {
      return new Response(`Error updating post scores: ${error.message}`, {
        status: 500,
      })
    } else {
      return new Response('Unknown error occurred', {
        status: 500,
      })
    }
  }

  return new Response('Post scores updated!', { status: 200 })
}
