import type { Metadata } from 'next'
import PostCreationForm from '@/components/actions/post-creation-form'

export const metadata: Metadata = {
  title: 'Create Post',
  description:
    'Create a new post. Share news about the latest technology, ask questions, or introduce products.',
}

export default async function NewPage() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-4 font-bold">Create Post</h1>
        <PostCreationForm />
      </div>
    </div>
  )
}
