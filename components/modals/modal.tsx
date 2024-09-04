import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!isOpen) return null

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    onClose()
  }

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 dark:bg-white/50" />
      <div
        className="relative rounded bg-slate-100 pb-2 pt-8 dark:bg-slate-900"
        onClick={handleModalClick}
      >
        <div className="max-h-[80vh] w-[95vw] overflow-y-auto border-y border-slate-200 dark:border-slate-800 sm:w-[50vw]">
          <button className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
