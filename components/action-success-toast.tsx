'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { SUCCESS_TOAST_DURATION } from '@/lib/constants'
import {
  authMessages,
  userMessages,
  postMessages,
  commentMessages,
  replyMessages,
  voteMessages,
  bookmarkMessages,
} from '@/lib/messages'
import { removeQueryString } from '@/lib/utils'

export default function ActionSuccessToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryKeys = {
      login: 'login',
      logout: 'logout',
      userCreation: 'uc',
      userDeletion: 'ud',
      postCreation: 'pc',
      postDeletion: 'pd',
      commentDeletion: 'cd',
      replyCreation: 'rc',
      replyDeletion: 'rd',
      voteCreation: 'vc',
      voteDeletion: 'vd',
      voteType: 'vt',
      bookmarkCreation: 'bc',
      bookmarkDeletion: 'bd',
    }

    const actionResults = {
      loginSuccess: searchParams.has(queryKeys.login, 'success'),
      logoutSuccess: searchParams.has(queryKeys.logout, 'success'),
      userCreationSuccess: searchParams.has(queryKeys.userCreation, 'success'),
      userDeletionSuccess: searchParams.has(queryKeys.userDeletion, 'success'),
      postCreationSuccess: searchParams.has(queryKeys.postCreation, 'success'),
      postDeletionSuccess: searchParams.has(queryKeys.postDeletion, 'success'),
      commentDeletionSuccess: searchParams.has(
        queryKeys.commentDeletion,
        'success',
      ),
      replyCreationSuccess: searchParams.has(
        queryKeys.replyCreation,
        'success',
      ),
      replyDeletionSuccess: searchParams.has(
        queryKeys.replyDeletion,
        'success',
      ),
      voteCreationSuccess: searchParams.has(queryKeys.voteCreation, 'success'),
      voteDeletionSuccess: searchParams.has(queryKeys.voteDeletion, 'success'),
      voteIsUp: searchParams.has(queryKeys.voteType, 'up'),
      voteIsDown: searchParams.has(queryKeys.voteType, 'down'),
      bookmarkCreationSuccess: searchParams.has(
        queryKeys.bookmarkCreation,
        'success',
      ),
      bookmarkDeletionSuccess: searchParams.has(
        queryKeys.bookmarkDeletion,
        'success',
      ),
    }

    const scroll =
      searchParams.has(queryKeys.login) ||
      searchParams.has(queryKeys.logout) ||
      searchParams.has(queryKeys.userCreation) ||
      searchParams.has(queryKeys.userDeletion) ||
      searchParams.has(queryKeys.postCreation) ||
      searchParams.has(queryKeys.postDeletion) ||
      searchParams.has(queryKeys.commentDeletion) ||
      searchParams.has(queryKeys.replyCreation) ||
      searchParams.has(queryKeys.replyDeletion)

    if (
      scroll ||
      searchParams.has(queryKeys.voteCreation) ||
      searchParams.has(queryKeys.voteDeletion) ||
      searchParams.has(queryKeys.bookmarkCreation) ||
      searchParams.has(queryKeys.bookmarkDeletion)
    ) {
      const newQueryString = removeQueryString(
        searchParams,
        Object.values(queryKeys),
      )
      router.replace(`${pathname}?${newQueryString}`, { scroll })
    }

    const idSuffix = '-success-toast'

    if (actionResults.loginSuccess) {
      toast.success(authMessages.login.success, {
        id: `login${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.logoutSuccess) {
      toast.success(authMessages.logout.success, {
        id: `logout${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.userCreationSuccess) {
      toast.success(userMessages.create.success, {
        id: `user-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.userDeletionSuccess) {
      toast.success(userMessages.delete.success, {
        id: `user-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.postCreationSuccess) {
      toast.success(postMessages.create.success, {
        id: `post-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.postDeletionSuccess) {
      toast.success(postMessages.delete.success, {
        id: `post-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.commentDeletionSuccess) {
      toast.success(commentMessages.delete.success, {
        id: `comment-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.replyCreationSuccess) {
      toast.success(replyMessages.create.success, {
        id: `reply-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.replyDeletionSuccess) {
      toast.success(replyMessages.delete.success, {
        id: `reply-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.voteCreationSuccess && actionResults.voteIsUp) {
      toast.success(voteMessages.create.successes.up, {
        id: `up-vote-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.voteCreationSuccess && actionResults.voteIsDown) {
      toast.success(voteMessages.create.successes.down, {
        id: `down-vote-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.voteDeletionSuccess && actionResults.voteIsUp) {
      toast.success(voteMessages.delete.success, {
        id: `up-vote-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.voteDeletionSuccess && actionResults.voteIsDown) {
      toast.success(voteMessages.delete.success, {
        id: `down-vote-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.bookmarkCreationSuccess) {
      toast.success(bookmarkMessages.create.success, {
        id: `bookmark-creation${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    } else if (actionResults.bookmarkDeletionSuccess) {
      toast.success(bookmarkMessages.delete.success, {
        id: `bookmark-deletion${idSuffix}`,
        duration: SUCCESS_TOAST_DURATION,
      })
    }
  }, [router, pathname, searchParams])

  return null
}
