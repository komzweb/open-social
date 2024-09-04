'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/actions/submit-button'
import { deleteUser } from '@/db/actions/user-actions'
import { initialFormState } from '@/lib/initial-form-state'
import {
  DELETED_EMAIL_COOLDOWN_DAYS,
  ERROR_TOAST_DURATION,
} from '@/lib/constants'

export default function UserAccountDeletionModal({
  userId,
  username,
}: {
  userId: string
  username: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteUserBound = deleteUser.bind(null, userId)
  const [formState, formAction] = useFormState(
    deleteUserBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'user-deletion-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="h-8 rounded border border-red-500 px-2 text-xs text-red-500 hover:border-red-600 hover:text-red-600 dark:border-red-400 dark:text-red-400 dark:hover:border-red-500 dark:hover:text-red-500"
      >
        Delete Account
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h2 className="font-bold">Delete Account?</h2>
            <p className="text-sm">
              <span className="text-slate-500">Account Name: </span>
              <span className="font-semibold">{username}</span>
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li className="text-xs text-red-600 dark:text-red-400">
                Deleting your account will permanently delete all your personal
                information and data. This action cannot be undone.
              </li>
              <li className="text-xs text-red-600 dark:text-red-400">
                Your posts and comments will not be automatically deleted. The
                author name will be hidden, but the page will remain accessible.
              </li>
              <li className="text-xs text-red-600 dark:text-red-400">
                After deleting your account, you will not be able to register
                with the same email address for {DELETED_EMAIL_COOLDOWN_DAYS}{' '}
                days.
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
