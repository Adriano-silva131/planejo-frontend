import { areaCategoryId } from '@/shared/theme/areaColors'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { boardDay, dayGlance } from '../weekBoard'

export type CollapsedBoardDayProps = {
  day: PlannedDay
  today: string
  now: number
  onOpen: (date: string) => void
}

// Os outros dias ao lado do dia aberto: só o nome do que cada um tem. O clique abre aquele dia.
export function CollapsedBoardDay({ day, today, now, onOpen }: CollapsedBoardDayProps) {
  const board = boardDay(day, today, now)
  const date = fromIsoDate(day.date)
  const items = dayGlance(board)

  return (
    <button
      type="button"
      data-day-toggle={day.date}
      onClick={() => onOpen(day.date)}
      aria-label={`Abrir ${longDateLabel(date)}${board.isToday ? ', hoje' : ''}`}
      className={joinClasses(
        'flex min-h-48 w-full min-w-0 cursor-pointer flex-col gap-1 rounded-card p-2 text-left hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-action',
        board.isPast ? 'border border-line' : 'bg-surface',
        board.isToday && 'ring-2 ring-action',
      )}
    >
      <span className="flex items-baseline gap-1 pb-1">
        <span className={joinClasses('type-meta', board.isToday ? 'text-action' : 'text-ink-muted')}>{shortWeekdayLabel(date)}</span>
        <span className={joinClasses('type-label tabular-nums', board.isToday && 'text-action')}>{date.getDate()}</span>
      </span>
      {items.map((item) => (
        <span
          key={item.key}
          data-category={areaCategoryId(item.area)}
          className={joinClasses(
            'block truncate border-l-2 border-hue-line type-caption',
            item.fixed ? 'pl-1.5 text-ink-muted' : 'rounded-control py-0.5 pr-1 pl-1.5 font-bold',
            !item.fixed && (item.done ? 'bg-hue text-on-hue' : 'bg-surface-alt text-ink'),
          )}
        >
          {item.title}
        </span>
      ))}
    </button>
  )
}
