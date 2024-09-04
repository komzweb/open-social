import Link from 'next/link'

import TimeAgo from '@/components/time-ago'
import UserAvatar from '@/components/user-avatar'
import AuthorUsername from '@/components/author-username'
import CommentListActions from '@/components/comment-list-actions'
import SanitizedContent from '@/components/sanitized-content'
import { getPostComments } from '@/db/actions/comment-actions'
import { cn } from '@/lib/utils'
import type { FetchedPostCommentListItem } from '@/types/comments'

export default async function PostComments({
  postId,
  currentUserId,
}: {
  postId: string
  currentUserId: string | undefined
}) {
  const comments = await getPostComments(postId, currentUserId)

  const renderComments = (
    comments: FetchedPostCommentListItem[],
    parentId: string | null = null,
    depth = 0,
  ) => {
    const filteredComments = comments.filter(
      (comment) => comment.parentId === parentId,
    )
    return filteredComments.map((comment) => (
      <div
        key={comment.id}
        id={comment.id}
        className={cn('space-y-2', depth > 0 && 'ml-8')}
      >
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-1 text-slate-500">
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
            <TimeAgo date={comment.createdAt} />
          </div>
          <div
            className={cn(
              'text-sm',
              (!comment.authorId || comment.deletedAt) &&
                'text-slate-300 dark:text-slate-700',
            )}
          >
            {comment.deletedAt ? (
              'This comment has been deleted'
            ) : (
              <SanitizedContent content={comment.content} />
            )}
          </div>
          {!comment.deletedAt && (
            <CommentListActions
              currentUserId={currentUserId}
              comment={{ ...comment, postId }}
            />
          )}
        </div>
        {renderComments(comments, comment.id, depth + 1)}
      </div>
    ))
  }

  return <div className="space-y-4">{renderComments(comments)}</div>
}
