import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { columnWidthClasses } from '../weekColumns'
import type { DayFree } from '../weekSummary'

export type WeekDayHeaderProps = {
  free: DayFree
  isToday: boolean
  // Encolhido quando outro dia está aberto: só o dia e o número.
  collapsed: boolean
  onOpen: (date: string) => void
}

// O cabeçalho de cada dia abre o dia na própria grade.
export function WeekDayHeader({ free, isToday, collapsed, onOpen }: WeekDayHeaderProps) {
  const date = fromIsoDate(free.date)
  const freeText = free.isEmpty ? 'dia todo livre' : `${formatDuration(free.freeMinutes)} livres`

  return (
    <button
      type="button"
      aria-expanded={false}
      data-day-toggle={free.date}
      onClick={() => onOpen(free.date)}
      className={joinClasses(
        'flex cursor-pointer flex-col gap-1.5 rounded-t-control py-2 text-left hover:bg-ink/5',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-action',
        collapsed ? `${columnWidthClasses.collapsed} items-center px-0` : `${columnWidthClasses.overview} px-2`,
        isToday && 'border-x border-t border-action/50 bg-highlight',
        free.isPast && 'opacity-60',
      )}
    >
      <span aria-hidden="true" className={joinClasses('flex items-baseline gap-1.5', collapsed && 'flex-col items-center gap-0')}>
        <span className={joinClasses('type-meta', isToday ? 'text-action' : 'text-ink-muted')}>{shortWeekdayLabel(date)}</span>
        <span className="type-label tabular-nums">{date.getDate()}</span>
      </span>
      {!collapsed && (
        <>
          <span aria-hidden="true">
            <ProgressBar value={free.busyMinutes} max={free.windowMinutes} label={`${formatDuration(free.busyMinutes)} ocupadas`} />
          </span>
          <span aria-hidden="true" className="truncate type-meta text-ink-muted">
            {freeText}
          </span>
        </>
      )}
      <span className="sr-only">{`Abrir ${longDateLabel(date)}${isToday ? ', hoje' : ''}: ${freeText}`}</span>
    </button>
  )
}
