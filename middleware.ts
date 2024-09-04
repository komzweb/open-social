import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'

import { authConfig } from '@/auth/auth.config'

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(request: NextRequest) {
  const session = await auth()
  const username = session?.user?.username

  if (session && !username && request.nextUrl.pathname !== '/register') {
    const registerUrl = new URL('/register', request.nextUrl.origin)
    return Response.redirect(registerUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
