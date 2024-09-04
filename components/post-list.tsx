import Link from 'next/link'
import { Suspense } from 'react'
import { Flame, MessageCircle } from 'lucide-react'

import Bookmark from '@/components/bookmark'
import Category from '@/components/category'
import TimeAgo from '@/components/time-ago'
import { cn } from '@/lib/utils'
import type { FetchedPostListItem } from '@/types/posts'

export default function PostList({
  posts,
  currentUserId,
}: {
  posts: FetchedPostListItem[]
  currentUserId: string | undefined
}) {
  if (posts.length === 0) {
    return (
      <div className="py-4">
        <p className="text-sm text-slate-300">No posts</p>
      </div>
    )
  }

  return (
    <div className="divide-y py-4 dark:divide-slate-800">
      {posts.map((post) => (
        <div key={post.id} className="py-2">
          <div className="flex items-start space-x-2">
            <div className="mt-1 rounded border border-slate-500 p-2">
              <Category category={post.category} />
            </div>
            <div className="flex flex-col space-y-1">
              <h2
                className={cn(
                  'font-bold sm:text-lg',
                  (!post.authorId || post.deletedAt) && 'text-slate-300',
                )}
              >
                <Link href={`/p/${post.id}`}>{post.title}</Link>
              </h2>
              <div className="flex items-center space-x-2.5 text-slate-500">
                <div className="flex items-center space-x-4 text-xs">
                  <div>
                    <TimeAgo date={post.createdAt} />
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.commentCount}</span>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <Flame className="h-3 w-3" />
                    <span>{post.voteSum}</span>
                  </div>
                </div>
                <Suspense fallback={null}>
                  <Bookmark
                    postId={post.id}
                    currentBookmarkerId={post.currentBookmarkerId}
                    iconSize={3}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
