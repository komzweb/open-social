import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import {
  LOGIN_LIMIT,
  LOGIN_INTERVAL_STR,
  PROFILE_EDIT_LIMIT,
  PROFILE_EDIT_INTERVAL_STR,
  POST_CREATION_LIMIT,
  POST_CREATION_INTERVAL_STR,
  COMMENT_CREATION_LIMIT,
  COMMENT_CREATION_INTERVAL_STR,
  VOTE_LIMIT,
  VOTE_INTERVAL_STR,
  BOOKMARK_LIMIT,
  BOOKMARK_INTERVAL_STR,
} from '@/lib/constants'

// Using Multiple Limits: https://upstash.com/docs/oss/sdks/ts/ratelimit/features#using-multiple-limits

export const loginRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:login',
  limiter: Ratelimit.slidingWindow(LOGIN_LIMIT, LOGIN_INTERVAL_STR),
})

export const profileEditRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:profile_edit',
  limiter: Ratelimit.slidingWindow(
    PROFILE_EDIT_LIMIT,
    PROFILE_EDIT_INTERVAL_STR,
  ),
})

export const postCreationRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:post_creation',
  limiter: Ratelimit.slidingWindow(
    POST_CREATION_LIMIT,
    POST_CREATION_INTERVAL_STR,
  ),
})

export const commentCreationRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:comment_creation',
  limiter: Ratelimit.slidingWindow(
    COMMENT_CREATION_LIMIT,
    COMMENT_CREATION_INTERVAL_STR,
  ),
})

export const voteRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:vote',
  limiter: Ratelimit.slidingWindow(VOTE_LIMIT, VOTE_INTERVAL_STR),
})

export const bookmarkRateLimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: 'ratelimit:bookmark',
  limiter: Ratelimit.slidingWindow(BOOKMARK_LIMIT, BOOKMARK_INTERVAL_STR),
})
