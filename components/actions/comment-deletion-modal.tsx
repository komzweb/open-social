'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/actions/submit-button'
import { deleteComment } from '@/db/actions/comment-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'

export default function CommentDeletionModal({
  commentId,
  authorId,
  postId,
  createdAt,
  hasParent,
  isDeleted,
  commentContent,
}: {
  commentId: string
  authorId: string
  postId: string
  createdAt: Date
  hasParent: boolean
  isDeleted: boolean
  commentContent: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteCommentBound = deleteComment.bind(
    null,
    commentId,
    authorId,
    postId,
    createdAt,
    hasParent,
    isDeleted,
  )
  const [formState, formAction] = useFormState(
    deleteCommentBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'comment-deletion-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center space-x-2"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h2 className="font-bold">
              Are you sure you want to delete this{' '}
              {hasParent ? 'reply' : 'comment'}?
            </h2>
            <p className="line-clamp-3 text-sm text-slate-500">
              {commentContent}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>
          <div className="space-y-2 sm:flex sm:justify-end sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full rounded border border-slate-500 text-slate-500 hover:border-slate-600 hover:text-slate-600 dark:border-slate-400 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-500 sm:w-auto"
            >
              Cancel
            </Button>
            <form action={formAction}>
              <SubmitButton className="w-full rounded border border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 dark:border-red-400 dark:text-red-400 dark:hover:border-red-500 dark:hover:text-red-500 sm:w-auto">
                Delete
              </SubmitButton>
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}
