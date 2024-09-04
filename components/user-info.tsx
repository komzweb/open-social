import type { FetchedUserByUsername } from '@/types/users'

export default function UserInfo({ user }: { user: FetchedUserByUsername }) {
  return (
    <dl className="space-y-4">
      <div>
        <dt className="text-xs text-slate-500">Name</dt>
        <dd className="text-sm">{user.name || user.username}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-500">Username</dt>
        <dd className="text-sm">{user.username}</dd>
      </div>
      {user.bio && (
        <div>
          <dt className="text-xs text-slate-500">Bio</dt>
          <dd className="text-sm">{user.bio}</dd>
        </div>
      )}
      <div>
        <dt className="text-xs text-slate-500">Karma</dt>
        <dd className="text-sm">{user.score}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-500">Joined</dt>
        <dd className="text-sm">
          {user.createdAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </dd>
      </div>
    </dl>
  )
}
