import { Plus } from 'lucide-react'
import { isoWeekNumber, weekRangeLabel } from '@/shared/time/week'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekStepper } from '@/shared/ui/WeekStepper'

export type WeekHeaderProps = {
  start: Date
  freeMinutes?: number
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekHeader({ start, freeMinutes, onPrevious, onNext, onToday }: WeekHeaderProps) {
  return (
    <PageHeader
      eyebrow={`${weekRangeLabel(start)} · Semana ${isoWeekNumber(start)}`}
      title={
        freeMinutes === undefined ? (
          'Semana'
        ) : (
          <>
            Uma semana com <span className="text-peach-ink">{Math.floor(freeMinutes / 60)}h</span> livres.
          </>
        )
      }
      actions={
        <>
          <WeekStepper onPrevious={onPrevious} onNext={onNext} onToday={onToday} />
          <ButtonLink to="/atividades?atividade=nova" aria-label="Adicionar atividade">
            <Plus aria-hidden="true" className="size-5" />
            <span className="hidden sm:inline">Atividade</span>
          </ButtonLink>
        </>
      }
    />
  )
}
