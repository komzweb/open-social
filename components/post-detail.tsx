import Link from 'next/link'
import { Link as LinkIcon } from 'lucide-react'

import TimeAgo from '@/components/time-ago'
import Category from '@/components/category'
import UserAvatar from '@/components/user-avatar'
import AuthorUsername from '@/components/author-username'
import PostActions from '@/components/post-actions'
import SanitizedContent from '@/components/sanitized-content'
import { cn } from '@/lib/utils'
import type { FetchedPost } from '@/types/posts'

export default async function PostDetail({
  post,
  currentUserId,
}: {
  post: FetchedPost & { postId: string }
  currentUserId: string | undefined
}) {
  return (
    <div className="space-y-4">
      {post.deletedAt && (
        <div className="bg-red-200 px-2 py-1">
          <p className="text-xs text-slate-600">
            This post has been marked as &quot;deleted&quot; by the original
            author, but is still publicly viewable due to community
            considerations. If you have concerns about the content, please
            contact us.
          </p>
        </div>
      )}
      <div className="space-y-2">
        <h1 className="font-bold sm:text-lg">{post.title}</h1>
        <div className="flex items-center space-x-2">
          <div className="rounded border border-slate-500 p-1">
            <Category category={post.category} iconSize="3.5" />
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              {post.authorUsername && !post.deletedAt ? (
                <Link href={`/u/${post.authorUsername}`}>
                  <UserAvatar
                    image={post.authorImage}
                    username={post.authorUsername}
                    isItemDeleted={!!post.deletedAt}
                  />
                </Link>
              ) : (
                <UserAvatar
                  image={post.authorImage}
                  username={post.authorUsername}
                  isItemDeleted={!!post.deletedAt}
                />
              )}
              <AuthorUsername
                username={post.authorUsername}
                isItemDeleted={!!post.deletedAt}
              />
            </div>
            <span>·</span>
            <span>
              <TimeAgo date={post.createdAt} />
            </span>
          </div>
        </div>
      </div>
      {(post.url || post.content) && !post.deletedAt && (
        <div
          className={cn(
            'space-y-4 text-sm',
            !post.authorId && 'text-slate-300',
          )}
        >
          {post.url && (
            <div className="flex items-center space-x-1">
              <LinkIcon className="h-5 w-5" />
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {post.url}
              </a>
            </div>
          )}
          {post.content && <SanitizedContent content={post.content} />}
        </div>
      )}
      <PostActions post={post} currentUserId={currentUserId} />
    </div>
  )
}
