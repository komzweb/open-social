'use server'

import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'

import { auth } from '@/auth/auth'
import { db } from '@/db/drizzle'
import { BookmarksTable } from '@/db/schema'
import { generalErrors, bookmarkMessages } from '@/lib/messages'
import { bookmarkRateLimit } from '@/lib/rate-limits'
import { genBookmarkId } from '@/lib/nanoid'
import type { PrevState } from '@/types/common'

export async function createBookmark(
  postId: string,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  const { success } = await bookmarkRateLimit.limit(currentUserId)

  if (!success) {
    return {
      success: false,
      message: bookmarkMessages.create.errors.rateLimit,
    }
  }

  const bookmarkId = genBookmarkId()

  try {
    await db
      .insert(BookmarksTable)
      .values({ id: bookmarkId, bookmarkerId: currentUserId, postId })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: bookmarkMessages.create.errors.genericError,
    }
  }

  redirect(redirectPath)
}

export async function deleteBookmark(
  postId: string,
  redirectPath: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const currentUserId = session.user.id

  try {
    await db
      .delete(BookmarksTable)
      .where(
        and(
          eq(BookmarksTable.postId, postId),
          eq(BookmarksTable.bookmarkerId, currentUserId),
        ),
      )
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: bookmarkMessages.delete.error,
    }
  }

  redirect(redirectPath)
}
