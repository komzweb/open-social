'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPost } from '@/db/actions/post-actions'
import { initialFormState } from '@/lib/initial-form-state'
import { ERROR_TOAST_DURATION } from '@/lib/constants'

export default function PostCreationForm() {
  const [formState, formAction] = useFormState(createPost, initialFormState)

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'post-creation-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [formState?.success, formState?.message])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <div>
          <label htmlFor="title" className="text-xs">
            Title <span className="text-red-600">*</span>
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            required
            className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
          />
          {formState?.fieldErrors?.title && (
            <FieldError errors={formState.fieldErrors.title} />
          )}
        </div>
        <div>
          <label htmlFor="url" className="text-xs">
            URL
          </label>
          <Input
            type="url"
            id="url"
            name="url"
            className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
          />
          {formState?.fieldErrors?.url && (
            <FieldError errors={formState.fieldErrors.url} />
          )}
        </div>
        <div>
          <label htmlFor="content" className="text-xs">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
          />
          {formState?.fieldErrors?.content && (
            <FieldError errors={formState.fieldErrors.content} />
          )}
          <p className="ml-1 mt-1 text-xs text-slate-500">
            <Link href="/markdown" className="hover:underline">
              Markdown syntax
            </Link>
            can be used.
          </p>
        </div>
        <div>
          <label htmlFor="category" className="text-xs">
            Category <span className="text-red-600">*</span>
          </label>
          <Select name="category" required>
            <SelectTrigger
              id="category"
              className="w-[180px] rounded border-slate-300 bg-white focus:ring-1 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
              <SelectItem
                value="general"
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                General
              </SelectItem>
              <SelectItem
                value="ask"
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Ask
              </SelectItem>
              <SelectItem
                value="show"
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Show
              </SelectItem>
            </SelectContent>
          </Select>
          {formState?.fieldErrors?.category && (
            <FieldError errors={formState.fieldErrors.category} />
          )}
        </div>
      </div>
      <div className="text-right">
        <SubmitButton className="w-full rounded bg-teal-500 text-white hover:bg-teal-600 sm:w-auto">
          Create
        </SubmitButton>
      </div>
    </form>
  )
}
