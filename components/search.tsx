'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateQueryString } from '@/lib/hooks'
import { removeQueryString } from '@/lib/utils'

export default function Search() {
  const [value, setValue] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)

  const handleSearch = () => {
    router.replace(
      `${pathname}?${createQueryString({ search: encodeURIComponent(value) })}`,
    )
  }

  const handleReset = () => {
    setValue('')
    const newQueryString = removeQueryString(searchParams, ['search'])
    router.replace(`${pathname}?${newQueryString}`)
  }

  return (
    <div className="relative max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        id="search"
        placeholder="Search"
        value={value}
        onInput={(e) => {
          setValue(e.currentTarget.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
        className="rounded border-slate-300 pr-12 placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:placeholder:text-slate-700"
      />
      {value && (
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset Search"
          className="absolute right-0 top-0 p-2.5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
