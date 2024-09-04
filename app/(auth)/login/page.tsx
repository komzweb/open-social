import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import GitHubIcon from '@/components/icons/github-icon'
import LoginForm from '@/components/actions/login-form'
import { loginWithGithub } from '@/db/actions/auth-actions'
import { SITE_URL, LOGIN_INTERVAL } from '@/lib/constants'

const metaTitle = 'Login'
const metaDescription =
  'Login to your account to participate in the discussion.'

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/login`,
  },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  const error = searchParams.error

  return (
    <div className="rounded bg-slate-100 p-8 dark:bg-slate-900">
      <h1 className="mb-8 text-center text-xl font-bold">Login</h1>
      <div className="mb-4 border border-slate-600 p-3 dark:border-slate-400">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          If you are using it for the first time, an account will be created
          automatically.
        </p>
      </div>
      <div className="space-y-4">
        {error && (
          <div className="border border-red-600 bg-red-50 p-3 dark:border-red-400 dark:bg-slate-800">
            <p className="text-xs text-red-600 dark:text-red-400">
              {error === 'rl'
                ? `The number of login attempts is too high. Due to security reasons, login is temporarily restricted. Please try again after ${LOGIN_INTERVAL} minutes.`
                : 'Login failed. Please try again.'}
            </p>
          </div>
        )}
        <form action={loginWithGithub}>
          <Button className="w-full rounded border border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-950 hover:text-slate-300">
            <GitHubIcon type="submit" className="mr-2" />
            Continue with GitHub
          </Button>
        </form>
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-700" />
          <span className="min-w-max px-3 text-xs text-slate-500">or</span>
          <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-700" />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
