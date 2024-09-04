import BookmarkIcon from '@/components/icons/bookmark-icon'
import BookmarkCreation from '@/components/actions/bookmark-creation'
import BookmarkDeletion from '@/components/actions/bookmark-deletion'

export default function Bookmark({
  postId,
  currentBookmarkerId,
  bookmarkCount,
  iconSize = 4,
}: {
  postId: string
  currentBookmarkerId?: string | null
  bookmarkCount?: number
  iconSize?: 3 | 3.5 | 4 | 5
}) {
  const iconSizeClasses = {
    3: 'h-3 w-3',
    3.5: 'h-3.5 w-3.5',
    4: 'h-4 w-4',
    5: 'h-5 w-5',
  }

  return (
    <div className="flex items-center">
      {currentBookmarkerId && (
        <BookmarkDeletion
          postId={postId}
          iconSizeClass={iconSizeClasses[iconSize]}
        />
      )}
      {currentBookmarkerId === null && (
        <BookmarkCreation
          postId={postId}
          iconSizeClass={iconSizeClasses[iconSize]}
        />
      )}
      {currentBookmarkerId === undefined && (
        <BookmarkIcon
          className={`m-1.5 text-slate-300 dark:text-slate-700 ${iconSizeClasses[iconSize]}`}
        />
      )}
      {bookmarkCount !== undefined && <span>{bookmarkCount}</span>}
    </div>
  )
}
