import { type ReadonlyURLSearchParams } from 'next/navigation'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'

import type { FieldErrors } from '@/types/common'

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

export const calculateAgeSinceCreation = (
  createdAt: Date,
  unit: 'days' | 'hours' | 'minutes' = 'days',
): number => {
  const now = new Date()
  const msPerUnit = {
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
  }

  const timeDiff = now.getTime() - createdAt.getTime()
  return timeDiff / msPerUnit[unit]
}

export const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}` //
}

export const normalizeLineEndings = (text: string): string => {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

export const parseValidationErrors = (zodError: ZodError): FieldErrors => {
  const validationErrors: FieldErrors = {}

  zodError.errors.forEach((err) => {
    const field = err.path[0] as string
    if (validationErrors[field]) {
      validationErrors[field].push(err.message)
    } else {
      validationErrors[field] = [err.message]
    }
  })

  return validationErrors
}

export const removeQueryString = (
  searchParams: ReadonlyURLSearchParams,
  keys: string[],
): string => {
  const updatedParams = new URLSearchParams(searchParams.toString())
  keys.forEach((key) => updatedParams.delete(key))
  return updatedParams.toString()
}

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}
