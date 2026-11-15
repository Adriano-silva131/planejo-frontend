import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { useQuickAdd, type QuickAddDraft } from './quickAdd'

export type QuickAddButtonProps = {
  draft?: QuickAddDraft
}

// O "+" do topo das telas: abre o Adicionar rápido; fora do shell do app, cai no cadastro completo.
export function QuickAddButton({ draft }: QuickAddButtonProps) {
  const open = useQuickAdd()
  const content = (
    <>
      <Plus aria-hidden="true" className="size-5" />
      <span className="hidden sm:inline">Adicionar</span>
    </>
  )
  if (!open) {
    return (
      <ButtonLink to="/atividades?atividade=nova" aria-label="Adicionar atividade">
        {content}
      </ButtonLink>
    )
  }
  return (
    <Button aria-label="Adicionar" aria-keyshortcuts="N" onClick={() => open(draft)}>
      {content}
    </Button>
  )
}
