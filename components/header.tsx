import Link from 'next/link'
import { Earth } from 'lucide-react'

import { auth } from '@/auth/auth'
import AuthNav from '@/components/auth-nav'
import { APP_NAME } from '@/lib/constants'

export default async function Header({
  authNav = true,
}: {
  authNav?: boolean
}) {
  const session = await auth()
  const currentUser = session?.user

  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" prefetch={true} className="flex items-start space-x-2">
          <Earth className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-xs leading-none text-teal-500">Beta</span>
            <span className="mt-0.5 hidden font-bold leading-none sm:block">
              {APP_NAME}
            </span>
          </div>
        </Link>

        {authNav && <AuthNav currentUser={currentUser} />}
      </div>
    </header>
  )
}
