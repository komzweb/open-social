import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import CommentList from '@/components/comment-list'
import Pagination from '@/components/pagination'
import VoteFilterLinks from '@/components/filters/vote-filter-links'
import { getUserIdByUsername } from '@/db/actions/user-actions'
import { getUserVotedComments } from '@/db/actions/comment-actions'
import { ItemQueryParamsSchema } from '@/lib/validation-schemas'
import type {
  SearchParams,
  FetchedUserCommentListItem,
  VoteType,
} from '@/types'

type Props = {
  params: { username: string }
  searchParams: SearchParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username

  return {
    title: `${username}'s voted comments`,
    description: `${username}'s voted comments`,
  }
}

export default async function UserVotedCommentsPage({
  params,
  searchParams,
}: Props) {
  const parseResult = ItemQueryParamsSchema.safeParse(searchParams)

  if (!parseResult.success) {
    notFound()
  }

  const { page, vote } = parseResult.data

  const userId = await getUserIdByUsername(params.username)

  if (!userId) {
    notFound()
  }

  const session = await auth()
  const currentUserId = session?.user?.id

  if (!currentUserId || userId !== currentUserId) {
    notFound()
  }

  let voteType: VoteType | undefined

  if (!vote || vote === 'all') {
    voteType = undefined
  } else if (vote === 'up') {
    voteType = 1
  } else if (vote === 'down') {
    voteType = -1
  }

  const userVotedComments: FetchedUserCommentListItem[] =
    await getUserVotedComments({
      userId,
      currentUserId,
      voteType,
      page,
    })

  return (
    <div>
      <h1 className="mb-4 space-x-0.5 text-xs text-slate-500">
        <Link href={`/u/${params.username}`} className="hover:text-slate-600">
          {params.username}
        </Link>
        <span>&apos;s voted comments</span>
      </h1>
      <Suspense fallback={null}>
        <VoteFilterLinks vote={vote} />
      </Suspense>
      <Suspense
        fallback={
          <div className="py-4">
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <CommentList
          comments={userVotedComments}
          currentUserId={currentUserId}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Pagination page={page} pageItemCount={userVotedComments.length} />
      </Suspense>
    </div>
  )
}
