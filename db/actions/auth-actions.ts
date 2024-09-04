'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { signIn, signOut } from '@/auth/auth'
import { loginSchema } from '@/db/validation-schemas'
import { authMessages } from '@/lib/messages'
import { loginRateLimit } from '@/lib/rate-limits'
import { parseValidationErrors } from '@/lib/utils'
import type { PrevState } from '@/types/common'

const getClientIp = (): string => {
  const isDev = process.env.NODE_ENV === 'development'
  return headers().get('x-real-ip') ?? (isDev ? 'localhost' : 'unknown')
}

export async function loginWithGithub() {
  const ip = getClientIp()
  const rateLimit = await loginRateLimit.limit(ip)

  if (rateLimit.success) {
    await signIn('github')
  } else {
    redirect('/login?error=rl')
  }
}

export async function loginWithEmail(
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const parsedUser = loginSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsedUser.success) {
    const validationErrors = parseValidationErrors(parsedUser.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  const ip = getClientIp()
  const rateLimit = await loginRateLimit.limit(ip)

  if (rateLimit.success) {
    await signIn('resend', formData)
  } else {
    redirect('/login?error=rl')
  }
}

export async function logout(prevState: PrevState): Promise<PrevState> {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: authMessages.logout.error,
    }
  }

  redirect('/login?logout=success')
}
