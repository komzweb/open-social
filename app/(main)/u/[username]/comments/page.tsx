import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import CommentList from '@/components/comment-list'
import Pagination from '@/components/pagination'
import { getUserComments } from '@/db/actions/comment-actions'
import { getUserIdByUsername } from '@/db/actions/user-actions'
import { ItemQueryParamsSchema } from '@/lib/validation-schemas'
import { SITE_URL } from '@/lib/constants'
import type { SearchParams } from '@/types/common'
import type { FetchedUserCommentListItem } from '@/types/comments'

type Props = {
  params: { username: string }
  searchParams: SearchParams
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = params.username

  const metaTitle = `${username}'s comments`
  const metaDescription = `${username}'s comments`

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/u/${username}/comments`,
      images: previousImages,
    },
  }
}

export default async function UserCommentsPage({
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

  const userComments: FetchedUserCommentListItem[] = await getUserComments({
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
        <span>&apos;s comments</span>
      </h1>
      <Suspense
        fallback={
          <div className="py-4">
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <CommentList comments={userComments} currentUserId={currentUserId} />
      </Suspense>
      <Suspense fallback={null}>
        <Pagination page={page} pageItemCount={userComments.length} />
      </Suspense>
    </div>
  )
}
