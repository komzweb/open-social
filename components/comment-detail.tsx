import Link from 'next/link'
import { ListTree } from 'lucide-react'

import TimeAgo from '@/components/time-ago'
import UserAvatar from '@/components/user-avatar'
import AuthorUsername from '@/components/author-username'
import CommentActions from '@/components/comment-actions'
import SanitizedContent from '@/components/sanitized-content'
import { cn } from '@/lib/utils'
import type { FetchedComment } from '@/types/comments'

export default async function CommentDetail({
  comment,
  currentUserId,
}: {
  comment: FetchedComment
  currentUserId: string | undefined
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col-reverse text-xs text-slate-500 sm:flex-row sm:items-center sm:space-x-1">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {comment.authorUsername && !comment.deletedAt ? (
                <Link href={`/u/${comment.authorUsername}`}>
                  <UserAvatar
                    image={comment.authorImage}
                    username={comment.authorUsername}
                    isItemDeleted={!!comment.deletedAt}
                  />
                </Link>
              ) : (
                <UserAvatar
                  image={comment.authorImage}
                  username={comment.authorUsername}
                  isItemDeleted={!!comment.deletedAt}
                />
              )}
              <AuthorUsername
                username={comment.authorUsername}
                isItemDeleted={!!comment.deletedAt}
              />
            </div>
            <span>·</span>
            <span className="min-w-max">
              <TimeAgo date={comment.createdAt} />
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link
              href={`/p/${comment.postId}#${comment.id}`}
              className="flex min-w-max items-center space-x-1"
            >
              <ListTree className="h-3 w-3" />
              <span>Context</span>
            </Link>
          </div>
          <span className="hidden text-slate-300 dark:text-slate-700 sm:block">
            |
          </span>
          <div className="mb-4 sm:mb-0 sm:line-clamp-1">
            <span className="text-slate-700 dark:text-slate-600">Post: </span>
            <Link href={`/p/${comment.postId}`}>{comment.postTitle}</Link>
          </div>
        </div>
        <div
          className={cn(
            'text-sm',
            !comment.authorId && 'text-slate-300 dark:text-slate-700',
          )}
        >
          <SanitizedContent content={comment.content} />
        </div>
      </div>
      <CommentActions comment={comment} currentUserId={currentUserId} />
    </div>
  )
}
