import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import RegisterForm from '@/components/actions/register-form'
import { getDeletedEmailData } from '@/db/actions/user-actions'
import { DELETED_EMAIL_COOLDOWN_DAYS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Register your username. You can join the discussion immediately.',
}

export default async function RegisterPage() {
  const session = await auth()

  if (!session || !session.user.email) {
    redirect('/login')
  } else if (session.user.username) {
    redirect('/')
  }

  const deletedEmailData = await getDeletedEmailData(session?.user.email)

  if (deletedEmailData) {
    const cooldownDate = new Date()
    cooldownDate.setDate(cooldownDate.getDate() - DELETED_EMAIL_COOLDOWN_DAYS)

    if (deletedEmailData.lastDeletedAt > cooldownDate) {
      return (
        <div className="rounded bg-slate-100 p-8 dark:bg-slate-900">
          <h1 className="mb-4 text-center text-xl font-bold">
            Registration not possible
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This email address account was recently deleted.
            {DELETED_EMAIL_COOLDOWN_DAYS} days are not possible to register
            again.
          </p>
        </div>
      )
    }
  }

  return (
    <div className="rounded bg-slate-100 p-8 dark:bg-slate-900">
      <h1 className="mb-8 text-center text-xl font-bold">Register</h1>
      <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
        Username is a unique account name. It is used in the URL of the profile
        page.
      </p>
      <RegisterForm deletedEmailData={deletedEmailData} />
    </div>
  )
}
