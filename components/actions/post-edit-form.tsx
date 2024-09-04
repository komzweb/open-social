'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormState } from 'react-dom'
import { SquarePen } from 'lucide-react'
import { toast } from 'sonner'

import Modal from '@/components/modals/modal'
import FieldError from '@/components/actions/field-error'
import SubmitButton from '@/components/actions/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updatePost } from '@/db/actions/post-actions'
import { initialFormState } from '@/lib/initial-form-state'
import {
  cn,
  calculateAgeSinceCreation,
  normalizeLineEndings,
} from '@/lib/utils'
import {
  POST_EDIT_LIMIT,
  POSTS_TITLE_EDIT_TIME_LIMIT_HOURS,
  SUCCESS_TOAST_DURATION,
  ERROR_TOAST_DURATION,
} from '@/lib/constants'
import type { PostFormValues } from '@/types/posts'

export default function PostEditForm({
  originalPostId,
  currentTitle,
  currentUrl,
  currentContent,
  currentCategory,
  authorId,
  createdAt,
  isDeleted,
  postHistoryCount,
}: {
  originalPostId: string
  currentTitle: string
  currentUrl: string
  currentContent: string
  currentCategory: string
  authorId: string
  createdAt: Date
  isDeleted: boolean
  postHistoryCount: number
}) {
  const isEditLimit = postHistoryCount >= POST_EDIT_LIMIT

  const updatePostBound = updatePost.bind(
    null,
    originalPostId,
    currentTitle,
    currentUrl,
    currentContent,
    currentCategory,
    authorId,
    createdAt,
    isDeleted,
    isEditLimit,
  )
  const [formState, formAction] = useFormState(
    updatePostBound,
    initialFormState,
  )

  const initialValues = useMemo(
    () => ({
      title: currentTitle,
      url: currentUrl,
      content: currentContent,
      category: currentCategory,
    }),
    [currentTitle, currentUrl, currentContent, currentCategory],
  )

  const [formValues, setFormValues] = useState<PostFormValues>(initialValues)
  const [isTextChanged, setIsTextChanged] = useState(false)
  const [isSelectChanged, setIsSelectChanged] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hoursSinceCreation = calculateAgeSinceCreation(createdAt, 'hours')

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    const newValues = { ...formValues, [name]: value }
    setFormValues(newValues)

    const normalizedCurrentContent = normalizeLineEndings(currentContent)
    const normalizedNewContent = normalizeLineEndings(newValues.content)

    const isChanged =
      newValues.title.trim() !== currentTitle ||
      newValues.url.trim() !== currentUrl ||
      normalizedNewContent.trim() !== normalizedCurrentContent

    setIsTextChanged(isChanged)
  }

  const handleSelectChange = (value: string) => {
    const newValues = { ...formValues, category: value }
    setFormValues(newValues)

    const isChanged = newValues.category !== currentCategory
    setIsSelectChanged(isChanged)
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = useCallback(() => {
    setFormValues(initialValues)
    setIsTextChanged(false)
    setIsSelectChanged(false)
    setIsModalOpen(false)
  }, [initialValues])

  useEffect(() => {
    if (formState?.success === false && formState?.message) {
      toast.error(formState.message, {
        id: 'post-update-error-toast',
        duration: ERROR_TOAST_DURATION,
      })
    }

    if (formState?.success === true) {
      handleModalClose()

      if (formState?.message) {
        toast.success(formState.message, {
          id: 'post-update-success-toast',
          duration: SUCCESS_TOAST_DURATION,
        })
      }
    }
  }, [formState?.success, formState?.message, handleModalClose])

  return (
    <>
      <button
        type="button"
        onClick={() => handleModalOpen()}
        className="flex w-full items-center space-x-2"
      >
        <SquarePen className="h-4 w-4" />
        <span>Edit</span>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => handleModalClose()}>
        <div className="space-y-4 p-4">
          <h2 className="font-bold">Edit Post</h2>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <div>
                <label htmlFor="title" className="text-xs">
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleTextChange}
                  required
                  disabled={
                    hoursSinceCreation >= POSTS_TITLE_EDIT_TIME_LIMIT_HOURS
                  }
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {hoursSinceCreation >= POSTS_TITLE_EDIT_TIME_LIMIT_HOURS && (
                  <input type="hidden" name="title" value={formValues.title} />
                )}
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
                  value={formValues.url}
                  onChange={handleTextChange}
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {formState?.fieldErrors?.url && (
                  <FieldError errors={formState.fieldErrors.url} />
                )}
              </div>
              <div>
                <label htmlFor="content" className="text-xs">
                  Post Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formValues.content}
                  onChange={handleTextChange}
                  className="rounded border-slate-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-800"
                />
                {formState?.fieldErrors?.content && (
                  <FieldError errors={formState.fieldErrors.content} />
                )}
              </div>
              <div>
                <label htmlFor="category" className="text-xs">
                  Post Category
                </label>
                <Select
                  name="category"
                  value={formValues.category}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger
                    id="category"
                    className="w-[180px] rounded border-slate-300 bg-white focus:ring-1 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <SelectValue placeholder="Select" />
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
            <div className="space-y-2 sm:flex sm:justify-end sm:space-x-2 sm:space-y-0">
              <Button
                type="button"
                onClick={() => handleModalClose()}
                className="w-full rounded border border-slate-500 text-slate-500 hover:border-slate-600 hover:text-slate-600 dark:border-slate-400 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-500 sm:w-auto"
              >
                Cancel
              </Button>
              <SubmitButton
                disabled={(!isTextChanged && !isSelectChanged) || isEditLimit}
                className="w-full rounded bg-teal-500 text-white hover:bg-teal-600 sm:w-auto"
              >
                Update Post
              </SubmitButton>
            </div>
          </form>
          <p
            className={cn(
              'text-right text-xs',
              isEditLimit ? 'text-red-600' : 'text-slate-600',
            )}
          >
            {isEditLimit
              ? 'Edit limit reached'
              : `Edit count: ${postHistoryCount}/${POST_EDIT_LIMIT}`}
          </p>
        </div>
      </Modal>
    </>
  )
}
