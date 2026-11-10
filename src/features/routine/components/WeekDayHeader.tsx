import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import type { DayFree } from '../weekSummary'

export type WeekDayHeaderProps = {
  free: DayFree
  isToday: boolean
}

export function WeekDayHeader({ free, isToday }: WeekDayHeaderProps) {
  const date = fromIsoDate(free.date)
  const freeText = free.isEmpty ? 'dia todo livre' : `${formatDuration(free.freeMinutes)} livres`

  return (
    <div
      className={joinClasses(
        'flex min-w-0 flex-1 flex-col gap-1.5 px-2 py-2',
        isToday && 'rounded-t-control border-x border-t border-action/50 bg-highlight',
        free.isPast && 'opacity-60',
      )}
    >
      <p aria-hidden="true" className="flex items-baseline gap-1.5">
        <span className={joinClasses('type-meta', isToday ? 'text-action' : 'text-ink-muted')}>{shortWeekdayLabel(date)}</span>
        <span className="type-label tabular-nums">{date.getDate()}</span>
      </p>
      <ProgressBar value={free.busyMinutes} max={free.windowMinutes} label={`${formatDuration(free.busyMinutes)} ocupadas`} />
      <p className="truncate type-meta text-ink-muted">{freeText}</p>
      <span className="sr-only">{`${longDateLabel(date)}${isToday ? ', hoje' : ''}: ${freeText}`}</span>
    </div>
  )
}
