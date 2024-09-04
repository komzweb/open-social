import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import CommentDetail from '@/components/comment-detail'
import CommentCreationForm from '@/components/actions/comment-creation-form'
import { getComment, getCommentMetadata } from '@/db/actions/comment-actions'
import { SITE_URL } from '@/lib/constants'
import { truncate } from '@/lib/utils'
import type { FetchedComment } from '@/types/comments'

type Props = {
  params: { postId: string; commentId: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const postId = params.postId
  const commentId = params.commentId

  const comment = await getCommentMetadata(commentId)

  const maxCommentLength = 30
  const maxPostTitleLength = 20

  const commentContent = `${truncate(comment?.content ?? '', maxCommentLength)}`
  const commentPostTitle = `${truncate(comment?.postTitle ?? '', maxPostTitleLength)}`
  const commentAuthorUsername = `${comment?.authorUsername ?? 'Anonymous'}`

  const metaTitle = `${commentAuthorUsername}: "${commentContent}" - "${commentPostTitle}"`
  const metaDescription = `${commentAuthorUsername}'s comment "${commentContent}" is displayed. View the discussion on "${commentPostTitle}"`

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/p/${postId}/c/${commentId}`,
      images: previousImages,
    },
  }
}

export default async function CommentPage({ params }: Props) {
  const session = await auth()
  const currentUserId = session?.user?.id

  const postId = params.postId
  const commentId = params.commentId
  const comment: FetchedComment = await getComment(commentId, currentUserId)

  if (!comment || comment.deletedAt || comment.postId !== postId) {
    notFound()
  }

  return (
    <div>
      <h1 className="sr-only">
        {comment.authorUsername}&apos;s comment - Post &quot;{comment.postTitle}
        &quot;
      </h1>
      <Suspense
        fallback={
          <div>
            <h2 className="text-sm text-slate-500">Loading...</h2>
          </div>
        }
      >
        <CommentDetail comment={comment} currentUserId={currentUserId} />
        {session && (
          <div className="mt-4 max-w-3xl">
            <div className="rounded border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <CommentCreationForm
                postId={postId}
                parentId={commentId}
                isTargetDeleted={!!comment.deletedAt}
              />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  )
}
