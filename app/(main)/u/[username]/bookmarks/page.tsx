import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import PostList from '@/components/post-list'
import Pagination from '@/components/pagination'
import { getUserBookmarkedPosts } from '@/db/actions/post-actions'
import { getUserIdByUsername } from '@/db/actions/user-actions'
import { ItemQueryParamsSchema } from '@/lib/validation-schemas'
import type { SearchParams } from '@/types/common'
import type { FetchedPostListItem } from '@/types/posts'

type Props = {
  params: { username: string }
  searchParams: SearchParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username

  return {
    title: `${username}'s bookmarks`,
    description: `${username}'s bookmarks`,
  }
}

export default async function UserBookmarksPage({
  params,
  searchParams,
}: Props) {
  const parseResult = ItemQueryParamsSchema.safeParse(searchParams)

  if (!parseResult.success) {
    notFound()
  }

  const { page } = parseResult.data

  const userId = await getUserIdByUsername(params.username)

  if (!userId) {
    notFound()
  }

  const session = await auth()
  const currentUserId = session?.user?.id

  if (!currentUserId || userId !== currentUserId) {
    notFound()
  }

  const userBookmarkedPosts: FetchedPostListItem[] =
    await getUserBookmarkedPosts({
      userId,
      currentUserId,
      page,
    })

  return (
    <div>
      <h1 className="space-x-0.5 text-xs text-slate-500">
        <Link href={`/u/${params.username}`} className="hover:text-slate-600">
          {params.username}
        </Link>
        <span>&apos;s bookmarks</span>
      </h1>
      <Suspense
        fallback={
          <div className="py-4">
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <PostList posts={userBookmarkedPosts} currentUserId={currentUserId} />
      </Suspense>
      <Suspense fallback={null}>
        <Pagination page={page} pageItemCount={userBookmarkedPosts.length} />
      </Suspense>
    </div>
  )
}
