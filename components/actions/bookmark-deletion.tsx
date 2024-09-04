'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import BookmarkFillIcon from '@/components/icons/bookmark-fill-icon'
import { deleteBookmark } from '@/db/actions/bookmark-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'
import { useCreateQueryString } from '@/lib/hooks'

export default function BookmarkDeletion({
  postId,
  iconSizeClass,
}: {
  postId: string
  iconSizeClass: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)
  const redirectPath = `${pathname}?${createQueryString({ bd: 'success' })}`

  const deleteBookmarkBound = deleteBookmark.bind(null, postId, redirectPath)
  const [formState, formAction] = useFormState(
    deleteBookmarkBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'bookmark-deletion-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form action={formAction} className="flex items-center">
      <button
        type="submit"
        className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <BookmarkFillIcon className={`${iconSizeClass} text-teal-500`} />
      </button>
    </form>
  )
}
