'use client'

import { useFormState } from 'react-dom'

import FieldError from '@/components/actions/field-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginWithEmail } from '@/db/actions/auth-actions'
import { initialFormState } from '@/lib/initial-form-state'

export default function LoginForm() {
  const [formState, formAction] = useFormState(loginWithEmail, initialFormState)

  return (
    <form action={formAction}>
      <Input
        type="text"
        name="email"
        placeholder="email@example.com"
        className="rounded border-slate-300 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-700"
      />
      {formState?.fieldErrors?.email && (
        <FieldError errors={formState.fieldErrors.email} />
      )}
      <Button
        type="submit"
        className="mt-2 w-full rounded border border-slate-300 bg-white hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-900"
      >
        Continue with email
      </Button>
    </form>
  )
}
