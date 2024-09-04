import Link from 'next/link'
import { ListTree } from 'lucide-react'

import TimeAgo from '@/components/time-ago'
import UserAvatar from '@/components/user-avatar'
import AuthorUsername from '@/components/author-username'
import CommentListActions from '@/components/comment-list-actions'
import SanitizedContent from '@/components/sanitized-content'
import { cn } from '@/lib/utils'
import type { FetchedUserCommentListItem } from '@/types/comments'

export default function CommentList({
  comments,
  currentUserId,
}: {
  comments: FetchedUserCommentListItem[]
  currentUserId: string | undefined
}) {
  if (comments.length === 0) {
    return (
      <div className="py-4">
        <p className="text-sm text-slate-300">No comments</p>
      </div>
    )
  }

  return (
    <div className="divide-y py-4">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-2 py-2">
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
              <span className="text-slate-300">|</span>
              <Link
                href={`/p/${comment.postId}#${comment.id}`}
                className="flex min-w-max items-center space-x-1"
              >
                <ListTree className="h-3 w-3" />
                <span>Context</span>
              </Link>
            </div>
            <span className="hidden text-slate-300 sm:block">|</span>
            <div className="mb-4 line-clamp-1 sm:mb-0">
              <span className="text-slate-700">Post:</span>
              <Link href={`/p/${comment.postId}`}>{comment.postTitle}</Link>
            </div>
          </div>
          <div
            className={cn(
              'text-sm',
              (!comment.authorId || comment.deletedAt) && 'text-slate-300',
            )}
          >
            {comment.deletedAt ? (
              'This comment has been deleted'
            ) : (
              <SanitizedContent content={comment.content} />
            )}
          </div>
          <div className="text-xs">
            <CommentListActions
              comment={comment}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
