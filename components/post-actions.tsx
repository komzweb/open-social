import { Suspense } from 'react'
import { Ellipsis, Flag } from 'lucide-react'

import Vote from '@/components/vote'
import Bookmark from '@/components/bookmark'
import PostEditForm from '@/components/actions/post-edit-form'
import PostDeletionModal from '@/components/actions/post-deletion-modal'
import PostHistoryModal from '@/components/modals/post-history-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getPostHistory } from '@/db/actions/post-actions'
import type { FetchedPost } from '@/types/posts'

export default async function PostActions({
  post,
  currentUserId,
}: {
  post: FetchedPost & { postId: string }
  currentUserId: string | undefined
}) {
  const postHistory = await getPostHistory(post.postId)

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className="rounded-full border border-slate-200 dark:border-slate-800">
        <Suspense fallback={null}>
          <Vote
            itemType="post"
            itemId={post.postId}
            authorId={post.authorId}
            isItemDeleted={!!post.deletedAt}
            voteSum={post.voteSum}
            currentUserId={currentUserId}
            currentUserVoteType={post.currentUserVoteType}
          />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <Bookmark
          postId={post.postId}
          currentBookmarkerId={post.currentBookmarkerId}
          bookmarkCount={post.bookmarkCount}
        />
      </Suspense>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-2 p-2 text-slate-300 dark:text-slate-700">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </div>
          {postHistory.length > 0 && !post.deletedAt && (
            <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
              <PostHistoryModal postHistory={postHistory} />
            </div>
          )}
          {post.authorId === currentUserId && !post.deletedAt && (
            <>
              <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <PostEditForm
                  originalPostId={post.postId}
                  currentTitle={post.title}
                  currentUrl={post.url}
                  currentContent={post.content}
                  currentCategory={post.category}
                  authorId={post.authorId}
                  createdAt={post.createdAt}
                  isDeleted={!!post.deletedAt}
                  postHistoryCount={postHistory.length}
                />
              </div>
              <div className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <PostDeletionModal
                  postId={post.postId}
                  authorId={post.authorId}
                  createdAt={post.createdAt}
                  isDeleted={!!post.deletedAt}
                  postTitle={post.title}
                />
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
