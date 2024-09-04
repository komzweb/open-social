import { Suspense } from 'react'
import { Ellipsis, Flag } from 'lucide-react'

import Vote from '@/components/vote'
import CommentEditForm from '@/components/actions/comment-edit-form'
import CommentDeletionModal from '@/components/actions/comment-deletion-modal'
import CommentHistoryModal from '@/components/modals/comment-history-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCommentHistory } from '@/db/actions/comment-actions'
import type { FetchedComment } from '@/types/comments'

export default async function CommentActions({
  comment,
  currentUserId,
}: {
  comment: FetchedComment
  currentUserId: string | undefined
}) {
  const commentHistory = await getCommentHistory(comment.id)

  return (
    <div className="flex items-center space-x-2 text-xs">
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
          />
        </Suspense>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-2 p-2 text-slate-300 dark:text-slate-700">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </div>
          {commentHistory.length > 0 && !comment.deletedAt && (
            <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
              <CommentHistoryModal commentHistory={commentHistory} />
            </div>
          )}
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
