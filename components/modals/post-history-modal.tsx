'use client'

import { useState } from 'react'
import { History } from 'lucide-react'

import Category from '@/components/category'
import Modal from '@/components/modals/modal'
import type { PostHistoryItem } from '@/types/posts'

export default function PostHistoryModal({
  postHistory,
}: {
  postHistory: PostHistoryItem[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center space-x-2"
      >
        <History className="h-4 w-4" />
        <span>History</span>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="divide-y dark:divide-slate-800">
          <h2 className="p-2 text-center">History</h2>
          {postHistory.map((historyItem) => (
            <div key={historyItem.id} className="space-y-2 p-4 sm:p-6">
              <Category category={historyItem.category} />
              <h3 className="text-sm font-semibold">{historyItem.title}</h3>
              <p className="text-xs">{historyItem.url}</p>
              <p className="text-sm">{historyItem.content}</p>
              <p className="space-x-1 text-xs text-slate-500">
                <span>Edited:</span>
                <span>
                  {historyItem.lastEditedAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
