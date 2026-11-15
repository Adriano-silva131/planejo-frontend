import { QuickAddButton } from '@/shared/planning/QuickAddButton'
import { isoWeekNumber, weekRangeLabel } from '@/shared/time/week'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekStepper } from '@/shared/ui/WeekStepper'

// Sessões das recorrentes feitas na semana, das que ela pede. Numa semana que ainda não começou, só as previstas.
export type WeekScore = { done: number; total: number; upcoming: boolean }

export type WeekHeaderProps = {
  start: Date
  score?: WeekScore
  // Dia aberto: o Adicionar rápido já vem nele.
  addDate?: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekHeader({ start, score, addDate, onPrevious, onNext, onToday }: WeekHeaderProps) {
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
          <QuickAddButton draft={{ date: addDate }} />
        </>
      }
    />
  )
}
