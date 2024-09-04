import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { UsersTable, PostsTable, CommentsTable } from '@/db/schema'
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
} from '@/lib/constants'
import { userMessages, postMessages, commentMessages } from '@/lib/messages'
import { validationPatterns } from '@/lib/validation-patterns'

export const loginSchema = createInsertSchema(UsersTable, {
  email: z
    .string()
    .trim()
    .email({ message: userMessages.create.fieldErrors.email.invalid })
    .toLowerCase(),
}).pick({
  email: true,
})

export const userCreationSchema = createInsertSchema(UsersTable, {
  username: z
    .string()
    .trim()
    .min(USERS_USERNAME_MIN_LENGTH, {
      message: userMessages.create.fieldErrors.username.min,
    })
    .max(USERS_USERNAME_MAX_LENGTH, {
      message: userMessages.create.fieldErrors.username.max,
    })
    .regex(validationPatterns.username.chars, {
      message: userMessages.create.fieldErrors.username.regex.chars,
    })
    .regex(validationPatterns.username.startChar, {
      message: userMessages.create.fieldErrors.username.regex.startChar,
    }),
}).pick({
  username: true,
})

export const userUpdateSchema = createInsertSchema(UsersTable, {
  name: z.string().trim().max(USERS_NAME_MAX_LENGTH, {
    message: userMessages.update.fieldErrors.name.max,
  }),
  bio: z.string().trim().max(USERS_BIO_MAX_LENGTH, {
    message: userMessages.update.fieldErrors.bio.max,
  }),
}).pick({
  name: true,
  bio: true,
})

export const postCreationSchema = createInsertSchema(PostsTable, {
  title: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(POSTS_TITLE_MIN_LENGTH, {
          message: postMessages.create.fieldErrors.title.min,
        })
        .max(POSTS_TITLE_MAX_LENGTH, {
          message: postMessages.create.fieldErrors.title.max,
        }),
    ),
  url: z
    .string()
    .trim()
    .max(POSTS_URL_MAX_LENGTH, {
      message: postMessages.create.fieldErrors.url.max,
    })
    .regex(validationPatterns.url, {
      message: postMessages.create.fieldErrors.url.regex,
    }),
  content: z.string().trim().max(POSTS_CONTENT_MAX_LENGTH, {
    message: postMessages.create.fieldErrors.content.max,
  }),
  category: z.enum(['general', 'ask', 'show'], {
    errorMap: (issue, ctx) => ({
      message: postMessages.create.fieldErrors.category,
    }),
  }),
}).pick({
  title: true,
  url: true,
  content: true,
  category: true,
})

export const commentCreationSchema = createInsertSchema(CommentsTable, {
  content: z
    .string()
    .trim()
    .min(COMMENTS_CONTENT_MIN_LENGTH, {
      message: commentMessages.create.fieldErrors.content.min,
    })
    .max(COMMENTS_CONTENT_MAX_LENGTH, {
      message: commentMessages.create.fieldErrors.content.max,
    }),
}).pick({
  content: true,
})
