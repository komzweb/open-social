import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import PostList from '@/components/post-list'
import Pagination from '@/components/pagination'
import { getUserPosts } from '@/db/actions/post-actions'
import { getUserIdByUsername } from '@/db/actions/user-actions'
import { ItemQueryParamsSchema } from '@/lib/validation-schemas'
import { SITE_URL } from '@/lib/constants'
import type { SearchParams } from '@/types/common'
import type { FetchedPostListItem } from '@/types/posts'

type Props = {
  params: { username: string }
  searchParams: SearchParams
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = params.username

  const metaTitle = `${username}'s posts`
  const metaDescription = `${username}'s posts`

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/u/${username}/posts`,
      images: previousImages,
    },
  }
}

export default async function UserPostsPage({ params, searchParams }: Props) {
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

  const userPosts: FetchedPostListItem[] = await getUserPosts({
    currentUserId,
    filterUserId: userId,
    page,
  })

  return (
    <div>
      <h1 className="space-x-0.5 text-xs text-slate-500">
        <Link href={`/u/${params.username}`} className="hover:text-slate-600">
          {params.username}
        </Link>
        <span>&apos;s posts</span>
      </h1>
      <Suspense
        fallback={
          <div className="py-4">
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <PostList posts={userPosts} currentUserId={currentUserId} />
      </Suspense>
      <Suspense fallback={null}>
        <Pagination page={page} pageItemCount={userPosts.length} />
      </Suspense>
    </div>
  )
}
