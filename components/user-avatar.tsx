import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UserAvatar({
  image,
  username,
  isItemDeleted = false,
  size = 'small',
}: {
  image: string | null | undefined
  username: string | null
  isItemDeleted?: boolean
  size?: 'small' | 'medium' | 'large'
}) {
  const imageUrl = image && !isItemDeleted ? image : ''

  const fallbackText =
    username && !isItemDeleted
      ? size === 'small'
        ? username.charAt(0).toUpperCase()
        : username.substring(0, 2).toUpperCase()
      : ''

  const backgroundColor =
    username && !isItemDeleted
      ? getBackgroundColor(username)
      : 'bg-slate-200 dark:bg-slate-800'

  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  }[size]

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-2xl',
  }[size]

  return (
    <Avatar className={sizeClasses}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback
        className={`${backgroundColor} ${textSizeClasses} text-white`}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  )
}

function hashUsername(username: string) {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function getBackgroundColor(username: string) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ]
  const hash = hashUsername(username)
  const index = Math.abs(hash) % colors.length
  return colors[index]
}
