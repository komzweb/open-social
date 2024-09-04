import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import PostDetail from '@/components/post-detail'
import PostCommentList from '@/components/post-comment-list'
import CommentCreationForm from '@/components/actions/comment-creation-form'
import { getPost, getPostMetadata } from '@/db/actions/post-actions'
import { SITE_URL } from '@/lib/constants'
import { truncate } from '@/lib/utils'
import type { FetchedPost } from '@/types/posts'

type Props = {
  params: { postId: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const postId = params.postId

  const post = await getPostMetadata(postId)

  const maxPostTitleLength = 40

  const postTitle = `${truncate(post?.title ?? '', maxPostTitleLength)}`
  const postAuthorUsername = `${post?.authorUsername ?? 'Anonymous'}`

  const metaTitle = `${postAuthorUsername}'s post: "${postTitle}"`
  const metaDescription = `${postAuthorUsername}'s post: "${postTitle}"`

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/p/${postId}`,
      images: previousImages,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const session = await auth()
  const currentUserId = session?.user?.id

  const postId = params.postId
  const post: FetchedPost = await getPost(postId, currentUserId)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div>
            <h2 className="text-sm text-slate-500">Loading post...</h2>
          </div>
        }
      >
        <PostDetail post={{ ...post, postId }} currentUserId={currentUserId} />
        {session && !post.deletedAt && (
          <div className="max-w-3xl">
            <div className="rounded border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <CommentCreationForm
                postId={postId}
                parentId={null}
                isTargetDeleted={!!post.deletedAt}
              />
            </div>
          </div>
        )}
      </Suspense>
      <Suspense
        fallback={
          <div>
            <h2 className="text-sm text-slate-500">Loading comments...</h2>
          </div>
        }
      >
        <PostCommentList postId={postId} currentUserId={currentUserId} />
      </Suspense>
    </div>
  )
}
