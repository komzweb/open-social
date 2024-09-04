import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem-2px)] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-center text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded bg-slate-900 px-4 py-2 text-sm text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
      >
        Go to Home
      </Link>
    </div>
  )
}
