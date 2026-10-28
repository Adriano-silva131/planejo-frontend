import { useEffect, useRef, type ReactNode } from 'react'

export type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current
    if (open && !element?.open) element?.showModal()
    if (!open && element?.open) element.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-labelledby="dialog-title"
      onClose={onClose}
      className="m-auto w-full max-w-md bg-transparent p-4 text-ink backdrop:bg-ink/40"
    >
      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 md:p-6">
        <h2 id="dialog-title" className="type-section">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}
