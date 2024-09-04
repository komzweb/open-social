import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Resend from 'next-auth/providers/resend'
import type { Adapter } from 'next-auth/adapters'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

import { authConfig } from '@/auth/auth.config'
import { db } from '@/db/drizzle'
import { UsersTable, AccountsTable, VerificationTokensTable } from '@/db/schema'
import { updateLastLogin } from '@/db/actions/user-actions'
import { authSendRequest } from '@/lib/auth-send-request'
import { APP_NAME } from '@/lib/constants'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  providers: [
    GitHub,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: `${APP_NAME} <${process.env.EMAIL_FROM}>`,
      sendVerificationRequest({
        identifier: to,
        provider: { apiKey, from },
        url,
      }) {
        authSendRequest({
          apiKey,
          from,
          to,
          url,
        })
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: UsersTable,
    accountsTable: AccountsTable,
    verificationTokensTable: VerificationTokensTable,
  }) as Adapter,
  events: {
    async signIn({ user, isNewUser }) {
      if (!isNewUser && user.id) {
        try {
          await updateLastLogin(user.id)
        } catch (error) {
          console.error(error)
          throw new Error('Failed to update lastLoginAt')
        }
      }
    },
  },
})
