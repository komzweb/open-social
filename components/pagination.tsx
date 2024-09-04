'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ITEMS_PER_PAGE } from '@/lib/constants'
import { useCreateQueryString } from '@/lib/hooks'

export default function Pagination({
  page,
  pageItemCount,
}: {
  page: number
  pageItemCount: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)

  const prevPage = page - 1
  const nextPage = page + 1
  const previous = 'Previous 25 posts'
  const next = 'Next 25 posts'

  return (
    <div className="flex items-center space-x-1 text-xs">
      {page > 1 ? (
        <Link
          href={`${pathname}?${createQueryString({ page: prevPage })}`}
          prefetch={true}
          className="inline-flex h-7 items-center space-x-0.5 rounded border border-transparent px-2.5 hover:border-slate-200 dark:hover:border-slate-800"
        >
          <ChevronLeft className="h-2.5 w-2.5" />
          <span className="hidden sm:block">{previous}</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex h-7 items-center space-x-0.5 px-2.5"
        >
          <ChevronLeft className="h-2.5 w-2.5 text-slate-300 dark:text-slate-700" />
          <span className="hidden text-slate-300 dark:text-slate-700 sm:block">
            {previous}
          </span>
        </button>
      )}
      <div className="space-x-1">
        {page > 1 && (
          <Link
            href={`${pathname}?${createQueryString({ page: 1 })}`}
            prefetch={true}
            className="inline-flex h-7 items-center rounded border border-transparent px-2.5 hover:border-slate-200 dark:hover:border-slate-800"
          >
            1
          </Link>
        )}
        {page > 4 && (
          <span className="inline-flex h-7 items-center px-2.5 text-slate-500">
            ...
          </span>
        )}
        {page > 3 && (
          <Link
            href={`${pathname}?${createQueryString({ page: page - 2 })}`}
            prefetch={true}
            className="inline-flex h-7 items-center rounded border border-transparent px-2.5 hover:border-slate-200 dark:hover:border-slate-800"
          >
            {page - 2}
          </Link>
        )}
        {page > 2 && (
          <Link
            href={`${pathname}?${createQueryString({ page: page - 1 })}`}
            prefetch={true}
            className="inline-flex h-7 items-center rounded border border-transparent px-2.5 hover:border-slate-200 dark:hover:border-slate-800"
          >
            {page - 1}
          </Link>
        )}
        <span className="inline-flex h-7 items-center rounded bg-slate-200 px-2.5 dark:bg-slate-800">
          {page}
        </span>
        {pageItemCount === ITEMS_PER_PAGE && (
          <span className="inline-flex h-7 items-center px-2.5 text-slate-500">
            ...
          </span>
        )}
      </div>
      {pageItemCount === ITEMS_PER_PAGE ? (
        <Link
          href={`${pathname}?${createQueryString({ page: nextPage })}`}
          prefetch={true}
          className="inline-flex h-7 items-center space-x-0.5 rounded border border-transparent px-2.5 hover:border-slate-200 dark:hover:border-slate-800"
        >
          <span className="hidden sm:block">{next}</span>
          <ChevronRight className="h-2.5 w-2.5" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex h-7 items-center space-x-0.5 px-2.5"
        >
          <span className="hidden text-slate-300 dark:text-slate-700 sm:block">
            {next}
          </span>
          <ChevronRight className="h-2.5 w-2.5 text-slate-300 dark:text-slate-700" />
        </button>
      )}
    </div>
  )
}
