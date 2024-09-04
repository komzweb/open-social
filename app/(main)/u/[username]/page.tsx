import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import UserInfo from '@/components/user-info'
import UserAvatar from '@/components/user-avatar'
import UserProfileEditForm from '@/components/actions/user-profile-edit-form'
import UserAccountDeletionModal from '@/components/actions/user-account-deletion-modal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getUserByUsername } from '@/db/actions/user-actions'
import { SITE_URL } from '@/lib/constants'

type Props = {
  params: { username: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = params.username

  const metaTitle = `${username}'s Profile`
  const metaDescription = `${username}'s Profile`

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/u/${username}`,
      images: previousImages,
    },
  }
}

export default async function UserPage({ params }: Props) {
  const session = await auth()
  const isCurrentUser = session?.user?.username === params.username

  const user = await getUserByUsername(params.username)

  if (!user || !user.username) {
    notFound()
  }

  return (
    <div>
      <h1 className="sr-only">{user.username}&apos;s Page</h1>
      <div className="space-y-4">
        <h2 className="sr-only">{user.username}&apos;s Profile</h2>
        <Suspense
          fallback={
            <div>
              <h2 className="text-sm text-slate-500">Loading...</h2>
            </div>
          }
        >
          <UserAvatar
            image={user.image}
            username={user.username}
            size="large"
          />
          <UserInfo user={user} />
        </Suspense>
        {isCurrentUser && (
          <UserProfileEditForm
            userId={user.id}
            currentName={user.name}
            currentBio={user.bio}
          />
        )}
      </div>
      <div className="mt-8">
        <h2 className="sr-only">{user.username}&apos;s Items</h2>
        <div className="space-y-2 text-sm">
          <div className="space-x-1">
            <Link
              href={`/u/${user.username}/posts`}
              prefetch={true}
              className="hover:underline"
            >
              Posts
            </Link>
            <span className="text-slate-500">/</span>
            <Link
              href={`/u/${user.username}/comments`}
              prefetch={true}
              className="hover:underline"
            >
              Comments
            </Link>
          </div>
          {isCurrentUser && (
            <>
              <div className="space-x-1">
                <Link
                  href={`/u/${user.username}/voted-posts`}
                  prefetch={true}
                  className="hover:underline"
                >
                  Voted Posts
                </Link>
                <span className="text-slate-500">/</span>
                <Link
                  href={`/u/${user.username}/voted-comments`}
                  prefetch={true}
                  className="hover:underline"
                >
                  Voted Comments
                </Link>
              </div>
              <div>
                <Link
                  href={`/u/${user.username}/bookmarks`}
                  prefetch={true}
                  className="hover:underline"
                >
                  Bookmarks
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {isCurrentUser && (
        <div className="mt-4">
          <h2 className="sr-only">Advanced Settings</h2>
          <Accordion type="single" collapsible className="max-w-xs text-xs">
            <AccordionItem
              value="item-1"
              className="border-slate-200 dark:border-slate-800"
            >
              <AccordionTrigger>Account Settings</AccordionTrigger>
              <AccordionContent>
                <UserAccountDeletionModal
                  userId={user.id}
                  username={user.username}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  )
}
