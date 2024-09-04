'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import EmojiFrownIcon from '@/components/icons/emoji-frown-icon'
import EmojiLaughingIcon from '@/components/icons/emoji-laughing-icon'
import { createPostVote, createCommentVote } from '@/db/actions/vote-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'
import { useCreateQueryString } from '@/lib/hooks'
import { VoteType } from '@/types/votes'

export default function VoteCreation({
  itemType,
  itemId,
  voteType,
  iconSizeClass,
}: {
  itemType: 'post' | 'comment'
  itemId: string
  voteType: VoteType
  iconSizeClass: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCreateQueryString(searchParams)
  const voteTypeStr = voteType === 1 ? 'up' : 'down'
  const redirectPath = `${pathname}?${createQueryString({ vc: 'success', vt: voteTypeStr })}`

  const voteAction = itemType === 'post' ? createPostVote : createCommentVote
  const createVoteBound = voteAction.bind(null, itemId, voteType, redirectPath)
  const [formState, formAction] = useFormState(
    createVoteBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'vote-creation-error-toast',
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
        {voteType === 1 ? (
          <EmojiLaughingIcon className={iconSizeClass} />
        ) : (
          <EmojiFrownIcon className={iconSizeClass} />
        )}
      </button>
    </form>
  )
}
