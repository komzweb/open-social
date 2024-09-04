'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-10rem-2px)] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">500</h1>
      <h2 className="text-2xl font-semibold">Server Error</h2>
      <p className="text-center text-slate-500 dark:text-slate-400">
        We apologize, but there was an issue. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="rounded bg-slate-900 px-4 py-2 text-sm text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
      >
        Try again
      </button>
    </div>
  )
}
