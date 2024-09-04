'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq, ilike, sql } from 'drizzle-orm'

import { auth, signOut, unstable_update } from '@/auth/auth'
import { db } from '@/db/drizzle'
import { UsersTable, DeletedEmailsTable } from '@/db/schema'
import { userCreationSchema, userUpdateSchema } from '@/db/validation-schemas'
import { DELETED_EMAIL_COOLDOWN_DAYS } from '@/lib/constants'
import { generalErrors, userMessages } from '@/lib/messages'
import { profileEditRateLimit } from '@/lib/rate-limits'
import { parseValidationErrors } from '@/lib/utils'
import type { DeletedEmailData } from '@/types/users'
import type { PrevState } from '@/types/common'

export async function getUserById(id: string) {
  return (
    await db
      .select({
        score: UsersTable.score,
        createdAt: UsersTable.createdAt,
      })
      .from(UsersTable)
      .where(eq(UsersTable.id, id))
  )[0]
}

export async function getUserByUsername(username: string) {
  return (
    await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        username: UsersTable.username,
        image: UsersTable.image,
        bio: UsersTable.bio,
        score: UsersTable.score,
        createdAt: UsersTable.createdAt,
      })
      .from(UsersTable)
      .where(ilike(UsersTable.username, username))
  )[0]
}

export async function getUserByEmail(email: string) {
  return (
    await db.select().from(UsersTable).where(eq(UsersTable.email, email))
  )[0]
}

export async function getUserIdByUsername(username: string) {
  return (
    await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(ilike(UsersTable.username, username))
  )[0]?.id
}

export async function getUserIdByEmail(email: string) {
  return (
    await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
  )[0]?.id
}

export async function getDeletedEmailData(email: string) {
  return (
    await db
      .select()
      .from(DeletedEmailsTable)
      .where(ilike(DeletedEmailsTable.email, email))
  )[0]
}

export async function createUser(
  deletedEmailData: DeletedEmailData,
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const session = await auth()
  const currentUserId = session?.user?.id
  const currentUserEmail = session?.user?.email
  const currentUserUsername = session?.user?.username

  if (!currentUserId || !currentUserEmail)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  if (currentUserUsername)
    return {
      success: false,
      message: userMessages.create.errors.alreadyRegistered,
    }

  if (deletedEmailData) {
    const cooldownDate = new Date()
    cooldownDate.setDate(cooldownDate.getDate() - DELETED_EMAIL_COOLDOWN_DAYS)

    if (deletedEmailData.lastDeletedAt > cooldownDate) {
      return {
        success: false,
        message: userMessages.create.errors.cooldownPeriod,
      }
    }
  }

  const parsedUser = userCreationSchema.safeParse({
    username: formData.get('username'),
  })

  if (!parsedUser.success) {
    const validationErrors = parseValidationErrors(parsedUser.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  const newUsername = parsedUser.data.username

  if (!newUsername) {
    return {
      success: false,
      message: userMessages.create.errors.invalidUsername,
    }
  }

  try {
    const userIdByUsername = await getUserIdByUsername(newUsername)

    if (userIdByUsername) {
      return {
        success: false,
        fieldErrors: {
          username: [userMessages.create.fieldErrors.username.exists],
        },
      }
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: generalErrors.serverError,
    }
  }

  try {
    await db
      .update(UsersTable)
      .set({ username: newUsername })
      .where(eq(UsersTable.id, currentUserId))

    session.user.username = newUsername
    await unstable_update(session)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: userMessages.create.errors.genericError,
    }
  }

  redirect('/?uc=success')
}

export async function updateUser(
  userId: string,
  currentName: string | null,
  currentBio: string | null,
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== userId)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  const { success } = await profileEditRateLimit.limit(userId)

  if (!success) {
    return {
      success: false,
      message: userMessages.update.errors.rateLimit,
    }
  }

  const parsedUser = userUpdateSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  })

  if (!parsedUser.success) {
    const validationErrors = parseValidationErrors(parsedUser.error)
    return {
      success: false,
      fieldErrors: validationErrors,
    }
  }

  if (
    currentName === parsedUser.data.name &&
    currentBio === parsedUser.data.bio
  ) {
    return {
      success: true,
    }
  }

  try {
    await db
      .update(UsersTable)
      .set({
        ...parsedUser.data,
        lastUpdatedAt: new Date(),
      })
      .where(eq(UsersTable.id, userId))
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: userMessages.update.errors.genericError,
    }
  }

  revalidatePath('/u/[username]', 'page')

  return {
    success: true,
    message: userMessages.update.success,
  }
}

export async function updateUserScore(userId: string, points: number) {
  await db
    .update(UsersTable)
    .set({ score: sql`score + ${points}` })
    .where(eq(UsersTable.id, userId))
}

export async function updateLastLogin(userId: string) {
  await db
    .update(UsersTable)
    .set({ lastLoginAt: new Date() })
    .where(eq(UsersTable.id, userId))
}

export async function deleteUser(
  userId: string,
  prevState: PrevState,
): Promise<PrevState> {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== userId || !session?.user?.email)
    return {
      success: false,
      message: generalErrors.sessionError,
    }

  try {
    await db
      .insert(DeletedEmailsTable)
      .values({
        email: session.user.email.toLowerCase(),
        lastDeletedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: DeletedEmailsTable.email,
        set: {
          deleteCount: sql`${DeletedEmailsTable.deleteCount} + 1`,
          lastDeletedAt: new Date(),
        },
      })
    await signOut({ redirect: false })
    await db.delete(UsersTable).where(eq(UsersTable.id, userId))
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: userMessages.delete.error,
    }
  }

  redirect('/?ud=success')
}
