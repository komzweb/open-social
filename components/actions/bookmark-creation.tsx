'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import BookmarkIcon from '@/components/icons/bookmark-icon'
import { createBookmark } from '@/db/actions/bookmark-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'
import { useCreateQueryString } from '@/lib/hooks'

export default function BookmarkCreation({
  postId,
  iconSizeClass,
}: {
  postId: string
  iconSizeClass: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)
  const redirectPath = `${pathname}?${createQueryString({ bc: 'success' })}`

  const createBookmarkBound = createBookmark.bind(null, postId, redirectPath)
  const [formState, formAction] = useFormState(
    createBookmarkBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'bookmark-creation-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form action={formAction} className="flex items-center">
      <button
        type="submit"
        className="rounded-full p-1.5 hover:bg-slate-100 hover:text-teal-500 dark:hover:bg-slate-800"
      >
        <BookmarkIcon className={iconSizeClass} />
      </button>
    </form>
  )
}
