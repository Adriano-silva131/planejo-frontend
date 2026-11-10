import { toIsoDate } from '@/shared/time/calendarDate'
import { formatDuration, minutesSinceMidnight } from '@/shared/time/timeOfDay'
import { useNow } from '@/shared/time/useNow'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import type { PlannedDay } from '../api/routineTypes'
import { useWeekRoutine } from '../api/useWeekRoutine'
import { todayFree } from '../weekSummary'

export function FreeTodayCard() {
  const now = useNow()
  const today = toIsoDate(now)
  const routine = useWeekRoutine(today)

  const free = routine.isSuccess ? todayFree((routine.data.days ?? []) as PlannedDay[], today, minutesSinceMidnight(now)) : undefined
  if (!free) return null
  const { freeMinutes, busyMinutes, windowMinutes } = free

  return (
    <section aria-labelledby="free-today-title" className="flex flex-col gap-2 rounded-card bg-surface-alt p-4">
      <h2 id="free-today-title" className="type-meta text-ink-muted">
        Livre hoje
      </h2>
      <p className="type-headline tabular-nums">{formatDuration(freeMinutes)}</p>
      <ProgressBar
        value={busyMinutes}
        max={windowMinutes}
        label={`${formatDuration(busyMinutes)} de compromisso no que resta do dia`}
      />
      <p className="type-meta text-ink-muted">
        {busyMinutes > 0 ? `${formatDuration(busyMinutes)} de compromisso até a noite` : 'Nenhum compromisso até a noite'}
      </p>
    </section>
  )
}
