'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Input } from '@/components/ui/input'
import { createUser } from '@/db/actions/user-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'
import { DeletedEmailData } from '@/types/users'

export default function RegisterForm({
  deletedEmailData,
}: {
  deletedEmailData: DeletedEmailData
}) {
  const createUserBound = createUser.bind(null, deletedEmailData)
  const [formState, formAction] = useFormState(
    createUserBound,
    initialFormState,
  )

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'user-creation-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form action={formAction}>
      <label htmlFor="username" className="sr-only">
        Username
      </label>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="username"
        required
        className="rounded border-slate-300 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-700"
      />
      {formState?.fieldErrors?.username && (
        <FieldError errors={formState.fieldErrors.username} />
      )}
      <SubmitButton className="mt-2 w-full rounded bg-teal-500 text-white hover:bg-teal-600">
        Register
      </SubmitButton>
    </form>
  )
}
