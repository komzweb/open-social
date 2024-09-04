import Link from 'next/link'
import { type User } from 'next-auth'
import { Pencil } from 'lucide-react'

import UserAvatar from '@/components/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logout from '@/components/actions/logout'

export default function AuthNav({
  currentUser,
}: {
  currentUser: User | undefined
}) {
  return (
    <>
      {currentUser ? (
        <div className="flex items-center space-x-2.5">
          <Link
            href="/new"
            className="rounded-full p-2.5 text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Pencil className="h-5 w-5" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                image={currentUser.image}
                username={currentUser.username}
                size="medium"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900">
              <DropdownMenuLabel className="text-xs text-slate-500">
                {currentUser.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <Link href={`/u/${currentUser.username}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded border border-slate-500 px-3 py-2 text-xs text-slate-500 hover:border-slate-600 hover:text-slate-600 dark:border-slate-300 dark:text-slate-300 dark:hover:border-slate-200 dark:hover:text-slate-200"
        >
          Login
        </Link>
      )}
    </>
  )
}
