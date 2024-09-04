import {
  USERS_USERNAME_MIN_LENGTH,
  USERS_USERNAME_MAX_LENGTH,
  USERS_NAME_MAX_LENGTH,
  USERS_BIO_MAX_LENGTH,
  POSTS_TITLE_MIN_LENGTH,
  POSTS_TITLE_MAX_LENGTH,
  POSTS_URL_MAX_LENGTH,
  POSTS_CONTENT_MAX_LENGTH,
  COMMENTS_CONTENT_MIN_LENGTH,
  COMMENTS_CONTENT_MAX_LENGTH,
  PROFILE_EDIT_INTERVAL,
  POST_CREATION_INTERVAL,
  COMMENT_CREATION_INTERVAL,
  VOTE_INTERVAL,
  BOOKMARK_INTERVAL,
  POST_EDIT_LIMIT,
  COMMENT_EDIT_LIMIT,
  DELETED_EMAIL_COOLDOWN_DAYS,
} from '@/lib/constants'

export const generalErrors = {
  serverError: 'Server error occurred',
  sessionError: 'An error occurred. Please log in again.',
}

export const authMessages = {
  login: {
    success: 'Logged in successfully',
    error: 'Authentication failed',
  },

  logout: {
    success: 'Logged out successfully',
    error: 'Logout failed',
  },
}

export const userMessages = {
  create: {
    success: 'Account created successfully',
    errors: {
      genericError: 'Account creation failed',
      alreadyRegistered: 'Username already exists',
      cooldownPeriod: `This email address has recently been deleted. You cannot register again for ${DELETED_EMAIL_COOLDOWN_DAYS} days`,
      invalidUsername: 'Invalid username',
    },
    fieldErrors: {
      username: {
        min: `Username must be at least ${USERS_USERNAME_MIN_LENGTH} characters long`,
        max: `Username must be at most ${USERS_USERNAME_MAX_LENGTH} characters long`,
        regex: {
          chars:
            'Username must only contain alphanumeric characters and underscores',
          startChar: 'Username must start with a letter',
        },
        exists: 'Username already exists',
      },
      email: {
        invalid: 'Invalid email address',
      },
    },
  },

  update: {
    success: 'Profile updated successfully',
    errors: {
      genericError: 'Profile update failed',
      rateLimit: `Profile editing is temporarily limited. Please try again in ${PROFILE_EDIT_INTERVAL} minutes`,
    },
    fieldErrors: {
      name: {
        max: `Name must be at most ${USERS_NAME_MAX_LENGTH} characters long`,
      },
      bio: {
        max: `Bio must be at most ${USERS_BIO_MAX_LENGTH} characters long`,
      },
    },
  },

  delete: {
    success: 'Account deleted successfully',
    error: 'Account deletion failed',
  },
}

const postAlreadyDeleted = 'This post has already been deleted'

export const postMessages = {
  create: {
    success: 'Post created successfully',
    errors: {
      genericError: 'Post creation failed',
      rateLimit: `Post creation is temporarily limited. Please try again in ${POST_CREATION_INTERVAL} minutes`,
    },
    fieldErrors: {
      title: {
        min: `Title must be at least ${POSTS_TITLE_MIN_LENGTH} characters long`,
        max: `Title must be at most ${POSTS_TITLE_MAX_LENGTH} characters long`,
      },
      url: {
        max: `URL must be at most ${POSTS_URL_MAX_LENGTH} characters long`,
        regex: 'Invalid URL format',
      },
      content: {
        max: `Content must be at most ${POSTS_CONTENT_MAX_LENGTH} characters long`,
      },
      category: 'Category must be selected',
    },
  },

  update: {
    success: 'Post updated successfully',
    errors: {
      genericError: 'Post update failed',
      editLimit: `You can edit a post ${POST_EDIT_LIMIT} times`,
      postAlreadyDeleted,
    },
    fieldErrors: {
      title: {
        timeLimit: 'Title editing time limit exceeded',
      },
    },
  },

  delete: {
    success: 'Post deleted successfully',
    errors: {
      genericError: 'Post deletion failed',
      postAlreadyDeleted,
    },
  },
}

const commentAlreadyDeleted = 'This comment has already been deleted'
const targetPostAlreadyDeleted = 'The target post has already been deleted'

export const commentMessages = {
  create: {
    success: 'Comment created successfully',
    errors: {
      genericError: 'Comment creation failed',
      rateLimit: `Comment creation is temporarily limited. Please try again in ${COMMENT_CREATION_INTERVAL} minutes`,
      targetPostAlreadyDeleted,
    },
    fieldErrors: {
      content: {
        min: `Content must be at least ${COMMENTS_CONTENT_MIN_LENGTH} characters long`,
        max: `Content must be at most ${COMMENTS_CONTENT_MAX_LENGTH} characters long`,
      },
    },
  },

  update: {
    success: 'Comment updated successfully',
    errors: {
      genericError: 'Comment update failed',
      editLimit: `You can edit a comment ${COMMENT_EDIT_LIMIT} times`,
      commentAlreadyDeleted,
    },
  },

  delete: {
    success: 'Comment deleted successfully',
    errors: {
      genericError: 'Comment deletion failed',
      commentAlreadyDeleted,
    },
  },
}

const replyAlreadyDeleted = 'This reply has already been deleted'
const targetCommentAlreadyDeleted =
  'The target comment has already been deleted'

export const replyMessages = {
  create: {
    success: 'Reply created successfully',
    errors: {
      genericError: 'Reply creation failed',
      rateLimit: `Reply creation is temporarily limited. Please try again in ${COMMENT_CREATION_INTERVAL} minutes`,
      targetCommentAlreadyDeleted,
    },
  },

  update: {
    success: 'Reply updated successfully',
    errors: {
      genericError: 'Reply update failed',
      editLimit: `You can edit a reply ${COMMENT_EDIT_LIMIT} times`,
      replyAlreadyDeleted,
    },
  },

  delete: {
    success: 'Reply deleted successfully',
    errors: {
      genericError: 'Reply deletion failed',
      replyAlreadyDeleted,
    },
  },
}

export const voteMessages = {
  create: {
    successes: {
      up: 'Upvoted successfully',
      down: 'Downvoted successfully',
    },
    errors: {
      genericError: 'Vote creation failed',
      postNotFound: 'Post not found',
      commentNotFound: 'Comment not found',
      deletedItem: 'Cannot vote on deleted posts or comments',
      deletedItemUser: 'Cannot vote on deleted posts or comments',
      notAllowed: 'Cannot vote on own posts or comments',
      alreadyVoted: 'Already voted',
      downvoteNotAllowed: 'Downvote not allowed',
      rateLimit: `Voting is temporarily limited. Please try again in ${VOTE_INTERVAL} minutes`,
    },
  },

  delete: {
    success: 'Vote deleted successfully',
    error: 'Vote deletion failed',
  },
}

export const bookmarkMessages = {
  create: {
    success: 'Bookmark created successfully',
    errors: {
      genericError: 'Bookmark creation failed',
      rateLimit: `Bookmark creation is temporarily limited. Please try again in ${BOOKMARK_INTERVAL} minutes`,
    },
  },

  delete: {
    success: 'Bookmark deleted successfully',
    error: 'Bookmark deletion failed',
  },
}
