import { ReadonlyURLSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const useCreateQueryString = (searchParams: ReadonlyURLSearchParams) => {
  return useCallback(
    (params: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(params)) {
        updatedParams.set(key, value.toString())
      }
      return updatedParams.toString()
    },
    [searchParams],
  )
}
