import { X } from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Button } from './Button'
import { joinClasses } from './joinClasses'

export type SheetProps = {
  eyebrow: string
  title: string
  onClose: () => void
  children: (close: () => void) => ReactNode
}

// Painel lateral sobre a tela atual. Abre ao montar; quem usa desmonta o painel no onClose,
// chamado depois da animação de saída. Ações internas fecham pela função passada aos filhos.
export function Sheet({ eyebrow, title, onClose, children }: SheetProps) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  const titleId = useId()
  const close = () => dialog?.close()

  useEffect(() => {
    if (dialog && !dialog.open) dialog.showModal()
  }, [dialog])

  return (
    <dialog
      ref={setDialog}
      aria-labelledby={titleId}
      onClose={(event) => {
        if (event.target !== event.currentTarget) return
        void Promise.all(event.currentTarget.getAnimations({ subtree: true }).map((animation) => animation.finished)).then(onClose)
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
      className={joinClasses(
        'my-0 mr-0 ml-auto h-dvh max-h-dvh w-full max-w-md border-l border-line bg-surface p-0 text-ink',
        'translate-x-full transition transition-discrete duration-250 ease-out open:translate-x-0 starting:open:translate-x-full',
        'backdrop:bg-scrim backdrop:opacity-0 backdrop:transition backdrop:transition-discrete backdrop:duration-250',
        'open:backdrop:opacity-100 starting:open:backdrop:opacity-0 motion-reduce:transition-none motion-reduce:backdrop:transition-none',
      )}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 md:px-6 md:pt-6">
          <div className="min-w-0">
            <p className="type-eyebrow text-ink-muted">{eyebrow}</p>
            <h2 id={titleId} className="truncate type-section">
              {title}
            </h2>
          </div>
          <Button variant="secondary" size="icon" aria-label="Fechar" onClick={close}>
            <X aria-hidden="true" className="size-5" />
          </Button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children(close)}</div>
      </div>
    </dialog>
  )
}
