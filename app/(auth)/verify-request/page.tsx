import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'

export const metadata: Metadata = {
  title: 'Check your email',
  description:
    'We sent you a sign-in link. Check your email to complete the sign-in.',
}

export default async function VerifyRequestPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className="rounded bg-slate-100 p-8 dark:bg-slate-900">
      <h1 className="mb-8 text-center text-lg font-bold text-teal-500">
        Check your email
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        We sent you a sign-in link. Check your email to complete the sign-in.
      </p>
    </div>
  )
}
