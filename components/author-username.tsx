import Link from 'next/link'

export default function AuthorUsername({
  username,
  isItemDeleted,
}: {
  username: string | null
  isItemDeleted: boolean
}) {
  const isDeleted = !username || isItemDeleted

  return isDeleted ? (
    <span className="text-slate-300 dark:text-slate-700">
      {getAuthorUsernameDisplay(username, isItemDeleted)}
    </span>
  ) : (
    <Link href={`/u/${username}`}>
      {getAuthorUsernameDisplay(username, isItemDeleted)}
    </Link>
  )
}

function getAuthorUsernameDisplay(
  username: string | null,
  isItemDeleted: boolean,
) {
  if (username && !isItemDeleted) {
    return username
  } else if (username && isItemDeleted) {
    return '[unknown]'
  } else {
    return '[deleted]'
  }
}
