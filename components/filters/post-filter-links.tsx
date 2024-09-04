'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { useCreateQueryString } from '@/lib/hooks'
import { cn } from '@/lib/utils'

export default function PostFilterLinks({
  sort,
  cat,
}: {
  sort: string
  cat: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)

  return (
    <div className="space-y-2 sm:space-x-2 sm:space-y-0">
      <div className="inline-flex w-32 rounded border border-slate-200 p-1 text-xs dark:border-slate-800">
        <Link
          href={{ pathname, query: createQueryString({ sort: 'score' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            sort === 'score' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          Popular
        </Link>
        <Link
          href={{ pathname, query: createQueryString({ sort: 'newest' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            sort === 'newest' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          Newest
        </Link>
      </div>
      <div className="inline-flex w-64 rounded border border-slate-200 p-1 text-xs dark:border-slate-800">
        <Link
          href={{ pathname, query: createQueryString({ cat: 'all' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            cat === 'all' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          All
        </Link>
        <Link
          href={{ pathname, query: createQueryString({ cat: 'general' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            cat === 'general' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          General
        </Link>
        <Link
          href={{ pathname, query: createQueryString({ cat: 'ask' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            cat === 'ask' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          Ask
        </Link>
        <Link
          href={{ pathname, query: createQueryString({ cat: 'show' }) }}
          replace
          prefetch={true}
          className={cn(
            'w-full p-1 text-center',
            cat === 'show' && 'rounded bg-slate-200 dark:bg-slate-800',
          )}
        >
          Show
        </Link>
      </div>
    </div>
  )
}
