'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateUser } from '@/db/actions/user-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { normalizeLineEndings } from '@/lib/utils'
import { SUCCESS_TOAST_DURATION, ERROR_TOAST_DURATION } from '@/lib/constants'
import type { UserFormValues } from '@/types/users'

export default function UserProfileEditForm({
  userId,
  currentName,
  currentBio,
}: {
  userId: string
  currentName: string | null
  currentBio: string | null
}) {
  const updateUserBound = updateUser.bind(null, userId, currentName, currentBio)
  const [formState, formAction] = useFormState(
    updateUserBound,
    initialFormState,
  )

  const initialValues = useMemo(
    () => ({
      name: currentName || '',
      bio: currentBio || '',
    }),
    [currentName, currentBio],
  )

  const [formValues, setFormValues] = useState<UserFormValues>(initialValues)
  const [isTextChanged, setIsTextChanged] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    const newValues = { ...formValues, [name]: value }
    setFormValues(newValues)

    const normalizedCurrentBio = normalizeLineEndings(currentBio || '')
    const normalizedNewBio = normalizeLineEndings(newValues.bio || '')

    const isChanged =
      newValues.name?.trim() !== currentName ||
      normalizedNewBio.trim() !== normalizedCurrentBio

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
        id: 'user-update-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }

    if (formState?.success === true) {
      handleModalClose()

      if (formState?.message) {
        toast.success(formState.message, {
          id: 'user-update-success-toast',
          duration: SUCCESS_TOAST_DURATION,
        })
      }
    }
  }, [formState?.success, formState?.message, handleModalClose])

  return (
    <>
      <Button
        type="button"
        onClick={() => handleModalOpen()}
        className="h-8 rounded border border-slate-500 px-2 text-xs text-slate-500 hover:border-slate-600 hover:text-slate-600 dark:border-slate-400 dark:text-slate-400 dark:hover:border-slate-300 dark:hover:text-slate-300"
      >
        Edit Profile
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => handleModalClose()}>
        <div className="space-y-4 p-4">
          <h2 className="font-bold">Edit Profile</h2>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <div>
                <label htmlFor="name" className="text-xs">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name || ''}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {formState?.fieldErrors?.name && (
                  <FieldError errors={formState.fieldErrors.name} />
                )}
              </div>
              <div>
                <label htmlFor="bio" className="text-xs">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formValues.bio || ''}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {formState?.fieldErrors?.bio && (
                  <FieldError errors={formState.fieldErrors.bio} />
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
                disabled={!isTextChanged}
                className="w-full rounded bg-teal-500 text-white hover:bg-teal-600 sm:w-auto"
              >
                Update Profile
              </SubmitButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
