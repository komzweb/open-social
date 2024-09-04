import VoteCreation from '@/components/actions/vote-creation'
import VoteDeletion from '@/components/actions/vote-deletion'
import EmojiFrownIcon from '@/components/icons/emoji-frown-icon'
import EmojiLaughingIcon from '@/components/icons/emoji-laughing-icon'

export default function Vote({
  itemType,
  itemId,
  authorId,
  isItemDeleted,
  voteSum,
  currentUserId,
  currentUserVoteType,
  iconSize = 4,
}: {
  itemType: 'post' | 'comment'
  itemId: string
  authorId: string | null
  isItemDeleted: boolean
  voteSum: number
  currentUserId: string | undefined
  currentUserVoteType?: number | null
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
      <>
        {currentUserVoteType === null &&
          authorId &&
          currentUserId &&
          authorId !== currentUserId &&
          !isItemDeleted && (
            <VoteCreation
              itemType={itemType}
              itemId={itemId}
              voteType={1}
              iconSizeClass={iconSizeClasses[iconSize]}
            />
          )}
        {currentUserVoteType === 1 && (
          <VoteDeletion
            itemType={itemType}
            itemId={itemId}
            voteType={1}
            iconSizeClass={iconSizeClasses[iconSize]}
          />
        )}
        {(currentUserVoteType === -1 ||
          !currentUserId ||
          authorId === currentUserId ||
          (!currentUserVoteType && !authorId) ||
          (!currentUserVoteType && isItemDeleted)) && (
          <EmojiLaughingIcon
            className={`m-1.5 text-slate-300 dark:text-slate-700 ${iconSizeClasses[iconSize]}`}
          />
        )}
      </>
      <span>{voteSum}</span>
      <>
        {currentUserVoteType === null &&
          authorId &&
          currentUserId &&
          authorId !== currentUserId &&
          !isItemDeleted && (
            <VoteCreation
              itemType={itemType}
              itemId={itemId}
              voteType={-1}
              iconSizeClass={iconSizeClasses[iconSize]}
            />
          )}
        {currentUserVoteType === -1 && (
          <VoteDeletion
            itemType={itemType}
            itemId={itemId}
            voteType={-1}
            iconSizeClass={iconSizeClasses[iconSize]}
          />
        )}
        {(currentUserVoteType === 1 ||
          !currentUserId ||
          authorId === currentUserId ||
          (!currentUserVoteType && !authorId) ||
          (!currentUserVoteType && isItemDeleted)) && (
          <EmojiFrownIcon
            className={`m-1.5 text-slate-300 dark:text-slate-700 ${iconSizeClasses[iconSize]}`}
          />
        )}
      </>
    </div>
  )
}
