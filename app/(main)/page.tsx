import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import Search from '@/components/search'
import PostList from '@/components/post-list'
import Pagination from '@/components/pagination'
import PostFilterLinks from '@/components/filters/post-filter-links'
import { getPosts } from '@/db/actions/post-actions'
import { ItemQueryParamsSchema } from '@/lib/validation-schemas'
import type { SearchParams } from '@/types/common'
import type { FetchedPostListItem } from '@/types/posts'

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const decodedSearchParams = {
    ...searchParams,
    search: (() => {
      try {
        if (typeof searchParams.search === 'string') {
          return decodeURIComponent(searchParams.search)
        }
        return undefined
      } catch (error) {
        console.error('Error decoding search parameter:', error)
        return searchParams.search
      }
    })(),
  }

  const parseResult = ItemQueryParamsSchema.safeParse(decodedSearchParams)

  if (!parseResult.success) {
    notFound()
  }

  const { page, sort, cat, search } = parseResult.data

  const session = await auth()
  const currentUserId = session?.user?.id

  const posts: FetchedPostListItem[] = await getPosts({
    currentUserId,
    page,
    sort,
    cat,
    search,
  })

  return (
    <div>
      <h1 className="sr-only">Posts</h1>
      <div className="space-y-2">
        <Suspense fallback={null}>
          <PostFilterLinks sort={sort} cat={cat} />
        </Suspense>
        <Suspense fallback={null}>
          <Search />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="py-4">
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <PostList posts={posts} currentUserId={currentUserId} />
      </Suspense>
      <Suspense fallback={null}>
        <Pagination page={page} pageItemCount={posts.length} />
      </Suspense>
    </div>
  )
}
