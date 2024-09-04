import type { NextAuthConfig, DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth' {
  interface User {
    username: string | null
  }
}

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
  },
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const paths = ['/new']
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path),
      )
      const isLoggedIn = !!auth?.user

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/login', nextUrl.origin)
        // redirectUrl.searchParams.append('callbackUrl', nextUrl.href)
        return Response.redirect(redirectUrl)
      }

      return true
    },
    jwt({ token, user, session }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      if (session) {
        return { ...token, username: session.user.username }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.username = token.username as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig
