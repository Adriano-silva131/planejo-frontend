import { Plus } from 'lucide-react'
import { longDateLabel } from '@/shared/time/dateLabels'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { PageHeader } from '@/shared/ui/PageHeader'

export type TodayHeaderProps = {
  date: Date
}

export function TodayHeader({ date }: TodayHeaderProps) {
  return (
    <PageHeader
      eyebrow={longDateLabel(date)}
      title="Cabe no dia. Cabe na vida."
      description="Seu plano pode mudar com você."
      actions={
        <ButtonLink to="/atividades/nova" variant="secondary" aria-label="Adicionar atividade">
          <Plus aria-hidden="true" className="size-5" />
          <span className="hidden md:inline">Adicionar atividade</span>
        </ButtonLink>
      }
    />
  )
}
