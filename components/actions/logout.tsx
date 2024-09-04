'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import SubmitButton from '@/components/actions/submit-button'
import { logout } from '@/db/actions/auth-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'

export default function Logout() {
  const [formState, formAction] = useFormState(logout, initialFormState)

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'logout-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form action={formAction}>
      <SubmitButton className="h-0 p-0 font-normal">Logout</SubmitButton>
    </form>
  )
}
