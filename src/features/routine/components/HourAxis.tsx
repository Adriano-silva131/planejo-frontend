import { joinClasses } from '@/shared/ui/joinClasses'
import { hourRow, rowCount, type HourRange } from '../weekGrid'

export type HourAxisProps = {
  range: HourRange
  rowsClass: string
}

export function HourAxis({ range, rowsClass }: HourAxisProps) {
  const hours = Array.from({ length: range.endHour - range.startHour }, (_, index) => range.startHour + index)
  return (
    <div aria-hidden="true" className={joinClasses('grid w-10 shrink-0', rowsClass)}>
      <div className={joinClasses('row-start-1', `row-span-${rowCount(range)}`)} />
      {hours.map((hour) => (
        <span
          key={hour}
          data-hour={hour}
          className={joinClasses(
            'col-start-1 pt-1 type-meta tabular-nums text-ink-muted',
            `row-start-${hourRow(hour, range)} row-span-12`,
            (hour - range.startHour) % 2 === 1 && 'invisible',
          )}
        >
          {String(hour).padStart(2, '0')}
        </span>
      ))}
    </div>
  )
}
