import { X } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { QuickAddContext, type QuickAddDraft } from '@/shared/planning/quickAdd'
import { Button } from '@/shared/ui/Button'
import { QuickAddDialog, type QuickAdded } from './QuickAddDialog'

const noticeMilliseconds = 8000

// O Adicionar rápido em qualquer tela do app: o "+" do topo, o "+" do dia aberto e a tecla N abrem a mesma janela.
// Depois de adicionar, a pessoa continua onde estava, com um aviso para editar os detalhes se quiser.
export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<QuickAddDraft | null>(null)
  const [added, setAdded] = useState<QuickAdded>()
  const open = useCallback((next?: QuickAddDraft) => setDraft(next ?? {}), [])
  useNewShortcut(open, draft !== null)
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(undefined), noticeMilliseconds)
    return () => clearTimeout(timer)
  }, [added])

  return (
    <QuickAddContext value={open}>
      {children}
      <QuickAddDialog
        open={draft !== null}
        draft={draft ?? undefined}
        onClose={() => setDraft(null)}
        onAdded={(result) => {
          setDraft(null)
          setAdded(result)
        }}
      />
      {added && <AddedNotice added={added} onDismiss={() => setAdded(undefined)} />}
    </QuickAddContext>
  )
}

// N abre o Adicionar rápido, a não ser que a pessoa esteja digitando ou com outra janela aberta.
function useNewShortcut(open: () => void, isOpen: boolean) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOpen || event.key.toLowerCase() !== 'n' || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return
      event.preventDefault()
      open()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, isOpen])
}

function AddedNotice({ added, onDismiss }: { added: QuickAdded; onDismiss: () => void }) {
  const what = added.kind === 'appointment' ? `como compromisso ${added.when}` : `com prazo até ${added.when}`
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-24 z-70 mx-auto flex max-w-md items-center gap-3 rounded-card border border-line bg-surface py-2 pr-2 pl-4 shadow-lg lg:bottom-6"
    >
      <p className="min-w-0 flex-1 type-meta">
        <strong>{added.task.title}</strong> adicionado {what}.
      </p>
      <Link
        to={`/atividades?atividade=${encodeURIComponent(added.task.id)}`}
        onClick={onDismiss}
        className="shrink-0 rounded-control type-meta font-semibold text-action hover:underline focus-visible:outline-2 focus-visible:outline-action"
      >
        Editar detalhes
      </Link>
      <Button variant="ghost" size="icon" aria-label="Fechar aviso" onClick={onDismiss}>
        <X aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
