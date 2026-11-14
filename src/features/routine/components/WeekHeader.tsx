import { Plus } from 'lucide-react'
import { isoWeekNumber, weekRangeLabel } from '@/shared/time/week'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekStepper } from '@/shared/ui/WeekStepper'

// Sessões das recorrentes feitas na semana, das que ela pede. Numa semana que ainda não começou, só as previstas.
export type WeekScore = { done: number; total: number; upcoming: boolean }

export type WeekHeaderProps = {
  start: Date
  score?: WeekScore
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekHeader({ start, score, onPrevious, onNext, onToday }: WeekHeaderProps) {
  return (
    <PageHeader
      eyebrow={`${weekRangeLabel(start)} · Semana ${isoWeekNumber(start)}`}
      title={
        !score || score.total === 0 ? (
          'Semana'
        ) : score.upcoming ? (
          <>
            <span className="text-peach-ink">{score.total}</span> sessões previstas.
          </>
        ) : (
          <>
            <span className="text-peach-ink">{score.done}</span> de {score.total} feitas.
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
