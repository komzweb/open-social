'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Textarea } from '@/components/ui/textarea'
import { createComment } from '@/db/actions/comment-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { SUCCESS_TOAST_DURATION, ERROR_TOAST_DURATION } from '@/lib/constants'

export default function CommentCreationForm({
  postId,
  parentId,
  isTargetDeleted,
}: {
  postId: string
  parentId: string | null
  isTargetDeleted: boolean
}) {
  const createCommentBound = createComment.bind(
    null,
    postId,
    parentId,
    isTargetDeleted,
  )
  const [formState, formAction] = useFormState(
    createCommentBound,
    initialFormState,
  )
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'comment-creation-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }

    if (formState?.success === true && formState?.message) {
      ref.current?.reset()

      toast.success(formState.message, {
        id: 'comment-creation-success-toast',
        duration: SUCCESS_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      <div>
        <Textarea
          id="content"
          name="content"
          required
          className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
        />
        {formState?.fieldErrors?.content && (
          <FieldError errors={formState.fieldErrors.content} />
        )}
        <p className="ml-1 mt-1 text-xs text-slate-500">
          <Link href="/markdown" className="mr-1 hover:underline">
            Markdown syntax
          </Link>
          can be used
        </p>
      </div>
      <div className="text-right">
        <SubmitButton className="rounded bg-teal-500 text-white hover:bg-teal-600">
          Submit {parentId ? 'reply' : 'comment'}
        </SubmitButton>
      </div>
    </form>
  )
}
