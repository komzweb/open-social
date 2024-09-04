'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/actions/submit-button'
import { deletePost } from '@/db/actions/post-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'

export default function PostDeletionModal({
  postId,
  authorId,
  createdAt,
  isDeleted,
  postTitle,
}: {
  postId: string
  authorId: string
  createdAt: Date
  isDeleted: boolean
  postTitle: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deletePostBound = deletePost.bind(
    null,
    postId,
    authorId,
    createdAt,
    isDeleted,
  )
  const [formState, formAction] = useFormState(
    deletePostBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'post-deletion-error_toast',
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
              Are you sure you want to delete this post?
            </h2>
            <p className="line-clamp-2 text-sm font-semibold text-slate-500">
              {postTitle}
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li className="text-xs text-red-600 dark:text-red-400">
                If there are actions from other users (comments, votes,
                bookmarks) on the post, the post will be marked as
                &quot;deleted&quot; and the page will remain in a viewable
                state. The post author name, post URL, and post content will be
                hidden.
              </li>
              <li className="text-xs text-red-600 dark:text-red-400">
                This action cannot be undone.
              </li>
            </ul>
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
