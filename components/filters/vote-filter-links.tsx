'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { useCreateQueryString } from '@/lib/hooks'
import { cn } from '@/lib/utils'

export default function VoteFilterLinks({ vote }: { vote: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)

  return (
    <div className="inline-flex w-48 rounded border border-slate-200 p-1 text-xs dark:border-slate-800">
      <Link
        href={{ pathname, query: createQueryString({ vote: 'all' }) }}
        replace
        prefetch={true}
        className={cn(
          'w-full p-1 text-center',
          vote === 'all' && 'rounded bg-slate-200 dark:bg-slate-800',
        )}
      >
        All
      </Link>
      <Link
        href={{ pathname, query: createQueryString({ vote: 'up' }) }}
        replace
        prefetch={true}
        className={cn(
          'w-full p-1 text-center',
          vote === 'up' && 'rounded bg-slate-200 dark:bg-slate-800',
        )}
      >
        Up
      </Link>
      <Link
        href={{ pathname, query: createQueryString({ vote: 'down' }) }}
        replace
        prefetch={true}
        className={cn(
          'w-full p-1 text-center',
          vote === 'down' && 'rounded bg-slate-200 dark:bg-slate-800',
        )}
      >
        Down
      </Link>
    </div>
  )
}
