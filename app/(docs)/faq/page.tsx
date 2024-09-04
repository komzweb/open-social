import type { Metadata } from 'next'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  APP_NAME,
  SITE_URL,
  DAYS_AS_NEW_USER,
  MIN_SCORE_FOR_REGULAR_USER,
} from '@/lib/constants'

const metaTitle = 'FAQ'
const metaDescription = `A page that summarizes frequently asked questions and their answers. You can check information about how to use ${APP_NAME}, its features, and troubleshooting.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/faq`,
  },
}

export default async function FAQPage() {
  return (
    <article>
      <header>
        <h1>FAQ</h1>
      </header>
      <Accordion type="single" collapsible>
        <section>
          <h2 className="sr-only">About {APP_NAME}</h2>
          <AccordionItem
            value="app-1"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">What is {APP_NAME}?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              {APP_NAME} is an application that provides a platform for open
              discussions focused on the latest technology.
            </AccordionContent>
          </AccordionItem>
        </section>
        <section>
          <h2 className="sr-only">About Account</h2>
          <AccordionItem
            value="account-1"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">How do I create an account?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              You can create an account and log in on the
              <Link href={'/login'}> login page</Link>. If you are using it for
              the first time, an account will be created automatically when you
              log in.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="account-2"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">Can I change my username?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              No, once created, the username cannot be changed.
            </AccordionContent>
          </AccordionItem>
        </section>
        <section>
          <h2 className="sr-only">About Posts, Comments, and Replies</h2>
          <AccordionItem
            value="items-1"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">How do I create a post?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              To create a post, you need to <Link href={'/login'}>login</Link>.
              After logging in, you can create a post from the
              <span className="mx-1 inline-flex items-center">
                <Pencil className="h-2.5 w-2.5" />
              </span>
              icon.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="items-2"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">Can I use Markdown?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              Yes, you can use Markdown for creating posts, comments, and
              replies. For details, please refer to{' '}
              <Link href={'/markdown'}>this page</Link>.
            </AccordionContent>
          </AccordionItem>
        </section>
        <section>
          <h2 className="sr-only">About Other Features</h2>
          <AccordionItem
            value="others-1"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">What is Karma?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              Karma is a numerical value that represents the user&apos;s
              contribution. It increases with high-quality posts and comments
              and serves as a measure of trust within the community.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="others-2"
            className="border-slate-200 dark:border-slate-800"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg">
              <span className="pr-2">
                Why can&apos;t I vote for some posts or comments?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-slate-300">
              There are the following rules for voting:
              <ul>
                <li>You can vote for a post or comment only once.</li>
                <li>You cannot vote for your own posts or comments.</li>
                <li>
                  You cannot vote for posts or comments from unknown users.
                </li>
                <li>
                  New users (users who have not created an account for less than{' '}
                  {DAYS_AS_NEW_USER} days or users with less than{' '}
                  {MIN_SCORE_FOR_REGULAR_USER} karma) cannot vote.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </article>
  )
}
