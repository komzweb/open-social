import Link from 'next/link'
import { Suspense } from 'react'
import { Ellipsis, FileText, Flag, MessageCircle } from 'lucide-react'

import Vote from '@/components/vote'
import CommentEditForm from '@/components/actions/comment-edit-form'
import CommentDeletionModal from '@/components/actions/comment-deletion-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCommentHistory } from '@/db/actions/comment-actions'
import type {
  FetchedPostCommentListItem,
  FetchedUserCommentListItem,
} from '@/types/comments'

type ExtendedPostCommentListItem = FetchedPostCommentListItem & {
  postId: string
}

export default async function PostCommentActions({
  currentUserId,
  comment,
}: {
  currentUserId: string | undefined
  comment: ExtendedPostCommentListItem | FetchedUserCommentListItem
}) {
  const commentHistory = await getCommentHistory(comment.id)

  return (
    <div className="mt-1 flex items-center space-x-2">
      <Link
        href={`/p/${comment.postId}/c/${comment.id}`}
        className="rounded-full border border-slate-200 p-1.5 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <MessageCircle className="h-3 w-3" />
      </Link>
      <div className="rounded-full border border-slate-200 dark:border-slate-800">
        <Suspense fallback={null}>
          <Vote
            itemType="comment"
            itemId={comment.id}
            authorId={comment.authorId}
            isItemDeleted={!!comment.deletedAt}
            voteSum={comment.voteSum}
            currentUserId={currentUserId}
            currentUserVoteType={comment.currentUserVoteType}
            iconSize={3}
          />
        </Suspense>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full border border-slate-200 p-1.5 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800">
          <Ellipsis className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-2 p-2 text-slate-300 dark:text-slate-700">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </div>
          <Link
            href={`/p/${comment.postId}/c/${comment.id}`}
            className="flex items-center space-x-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <FileText className="h-4 w-4" />
            <span>Details</span>
          </Link>
          {comment.postId && currentUserId === comment.authorId && (
            <>
              <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <CommentEditForm
                  originalCommentId={comment.id}
                  currentContent={comment.content}
                  authorId={comment.authorId}
                  postId={comment.postId}
                  hasParent={!!comment.parentId}
                  isDeleted={!!comment.deletedAt}
                  commentHistoryCount={commentHistory.length}
                />
              </div>
              <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <CommentDeletionModal
                  commentId={comment.id}
                  authorId={comment.authorId}
                  postId={comment.postId}
                  createdAt={comment.createdAt}
                  hasParent={!!comment.parentId}
                  isDeleted={!!comment.deletedAt}
                  commentContent={comment.content}
                />
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
