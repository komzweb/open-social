export const ORG_NAME = 'KomzLab'
export const APP_NAME = 'OpenSocial'
export const APP_DOMAIN = 'example.com'
export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? `https://${APP_DOMAIN}`
    : 'http://localhost:3000'

export const USERS_USERNAME_MIN_LENGTH = 4
export const USERS_USERNAME_MAX_LENGTH = 20
// export const USERS_PASSWORD_MIN_LENGTH = 8
// export const USERS_PASSWORD_MAX_LENGTH = 128
export const USERS_NAME_MAX_LENGTH = 40
export const USERS_BIO_MAX_LENGTH = 160

export const POSTS_TITLE_MIN_LENGTH = 10
export const POSTS_TITLE_MAX_LENGTH = 100
export const POSTS_URL_MAX_LENGTH = 1000
export const POSTS_CONTENT_MAX_LENGTH = 10000

export const COMMENTS_CONTENT_MIN_LENGTH = 20
export const COMMENTS_CONTENT_MAX_LENGTH = 2000

export const LOGIN_LIMIT = 3
export const LOGIN_INTERVAL = 15
export const LOGIN_INTERVAL_STR = `${LOGIN_INTERVAL} m`

export const PROFILE_EDIT_LIMIT = 3
export const PROFILE_EDIT_INTERVAL = 30
export const PROFILE_EDIT_INTERVAL_STR = `${PROFILE_EDIT_INTERVAL} m`

export const POST_CREATION_LIMIT = 5
export const POST_CREATION_INTERVAL = 15
export const POST_CREATION_INTERVAL_STR = `${POST_CREATION_INTERVAL} m`

export const COMMENT_CREATION_LIMIT = 10
export const COMMENT_CREATION_INTERVAL = 15
export const COMMENT_CREATION_INTERVAL_STR = `${COMMENT_CREATION_INTERVAL} m`

export const VOTE_LIMIT = 30
export const VOTE_INTERVAL = 15
export const VOTE_INTERVAL_STR = `${VOTE_INTERVAL} m`

export const BOOKMARK_LIMIT = 30
export const BOOKMARK_INTERVAL = 15
export const BOOKMARK_INTERVAL_STR = `${BOOKMARK_INTERVAL} m`

export const POST_EDIT_LIMIT = 5
export const COMMENT_EDIT_LIMIT = 3
export const DELETED_EMAIL_COOLDOWN_DAYS = 30

export const DAYS_AS_NEW_USER = 30
export const MIN_SCORE_FOR_REGULAR_USER = 10
export const MIN_SCORE_FOR_TRUSTED_USER = 100

export const POSTS_SCORE_DECAY_RATE = 1
export const POSTS_SCORE_DECAY_INTERVAL_DAYS = 7
export const POSTS_TITLE_EDIT_TIME_LIMIT_HOURS = 1
export const ITEMS_DELETION_PENALTY_DAYS = 30

export const ITEMS_PER_PAGE = 25
export const ITEM_LIST_MAX_PAGES = 100

export const SUCCESS_TOAST_DURATION = 5000
export const ERROR_TOAST_DURATION = 10000
