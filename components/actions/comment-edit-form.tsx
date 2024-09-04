'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormState } from 'react-dom'
import { SquarePen } from 'lucide-react'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateComment } from '@/db/actions/comment-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { cn, normalizeLineEndings } from '@/lib/utils'
import {
  COMMENT_EDIT_LIMIT,
  SUCCESS_TOAST_DURATION,
  ERROR_TOAST_DURATION,
} from '@/lib/constants'
import type { CommentFormValues } from '@/types/comments'

export default function CommentEditForm({
  originalCommentId,
  currentContent,
  authorId,
  postId,
  hasParent,
  isDeleted,
  commentHistoryCount,
}: {
  originalCommentId: string
  currentContent: string
  authorId: string
  postId: string
  hasParent: boolean
  isDeleted: boolean
  commentHistoryCount: number
}) {
  const isEditLimit = commentHistoryCount >= COMMENT_EDIT_LIMIT

  const updateCommentBound = updateComment.bind(
    null,
    originalCommentId,
    currentContent,
    authorId,
    postId,
    hasParent,
    isDeleted,
    isEditLimit,
  )
  const [formState, formAction] = useFormState(
    updateCommentBound,
    initialFormState,
  )

  const initialValues = useMemo(
    () => ({
      content: currentContent,
    }),
    [currentContent],
  )

  const [formValues, setFormValues] = useState<CommentFormValues>(initialValues)
  const [isTextChanged, setIsTextChanged] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const newValues = { ...formValues, [name]: value }
    setFormValues(newValues)

    const normalizedCurrentContent = normalizeLineEndings(currentContent)
    const normalizedNewContent = normalizeLineEndings(newValues.content)
    const isChanged = normalizedNewContent.trim() !== normalizedCurrentContent
    setIsTextChanged(isChanged)
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = useCallback(() => {
    setFormValues(initialValues)
    setIsTextChanged(false)
    setIsModalOpen(false)
  }, [initialValues])

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'comment-update-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }

    if (formState?.success === true) {
      handleModalClose()

      if (formState?.message) {
        toast.success(formState.message, {
          id: 'comment-update-success-toast',
          duration: SUCCESS_TOAST_DURATION,
        })
      }
    }
  }, [formState?.success, formState?.message, handleModalClose])

  return (
    <>
      <button
        type="button"
        onClick={() => handleModalOpen()}
        className="flex w-full items-center space-x-2"
      >
        <SquarePen className="h-4 w-4" />
        <span>Edit</span>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => handleModalClose()}>
        <div className="space-y-4 p-4">
          <h2 className="font-bold">Edit {hasParent ? 'reply' : 'comment'}</h2>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <div>
                <Textarea
                  id="content"
                  name="content"
                  value={formValues.content}
                  onChange={handleTextChange}
                  required
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {formState?.fieldErrors?.content && (
                  <FieldError errors={formState.fieldErrors.content} />
                )}
              </div>
            </div>
            <div className="space-y-2 sm:flex sm:justify-end sm:space-x-2 sm:space-y-0">
              <Button
                type="button"
                onClick={() => handleModalClose()}
                className="w-full rounded border border-slate-500 text-slate-500 hover:border-slate-600 hover:text-slate-600 dark:border-slate-400 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-500 sm:w-auto"
              >
                Cancel
              </Button>
              <SubmitButton
                disabled={!isTextChanged || isEditLimit}
                className="w-full rounded bg-teal-500 text-white hover:bg-teal-600 sm:w-auto"
              >
                Update {hasParent ? 'reply' : 'comment'}
              </SubmitButton>
            </div>
          </form>
          <p
            className={cn(
              'text-right text-xs',
              isEditLimit ? 'text-red-600' : 'text-slate-600',
            )}
          >
            {isEditLimit
              ? 'You have reached the limit of edits.'
              : `Edit count: ${commentHistoryCount}/${COMMENT_EDIT_LIMIT}`}
          </p>
        </div>
      </Modal>
    </>
  )
}
