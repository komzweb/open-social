import Link from 'next/link'

import { ModeToggle } from './mode-toggle'
import { ORG_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end md:items-center">
          <div className="flex flex-col space-x-0 space-y-2 text-sm md:flex-row md:space-x-4 md:space-y-0">
            <Link href={'/about'} className="hover:underline">
              About
            </Link>
            <Link href={'/guide'} className="hover:underline">
              Guide
            </Link>
            <Link href={'/faq'} className="hover:underline">
              FAQ
            </Link>
            <Link href={'/support'} className="hover:underline">
              Support
            </Link>
            <Link href={'/terms'} className="hover:underline">
              Terms
            </Link>
            <Link href={'/privacy'} className="hover:underline">
              Privacy
            </Link>
          </div>
          <div className="mt-4 flex w-full items-center justify-between space-x-4 sm:mt-0 sm:w-auto">
            <span className="text-xs">
              &copy; {new Date().getFullYear()} {ORG_NAME}
            </span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
