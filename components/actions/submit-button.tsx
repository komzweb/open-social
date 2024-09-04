'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export default function SubmitButton({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  const { pending } = useFormStatus()

  const isDisabled = pending || disabled

  return (
    <Button
      type={isDisabled ? 'button' : 'submit'}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={className}
    >
      {pending ? 'Loading...' : children}

      <span role="status" aria-live="polite" className="sr-only">
        {pending
          ? 'Loading...'
          : disabled
            ? 'Action button is disabled.'
            : 'Action button is enabled.'}
      </span>
    </Button>
  )
}
