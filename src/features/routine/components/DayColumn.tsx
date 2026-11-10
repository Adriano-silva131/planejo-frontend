import { minutesOfDay } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { useGridDrop } from '../hooks/useGridDrop'
import { movableDates } from '../sessionForm'
import { hourRow, layoutDay, rowCount, rowPlacement, type HourRange } from '../weekGrid'
import { freeStretch } from '../weekSummary'
import { PlannerBlock } from './PlannerBlock'

export type DayColumnProps = {
  day: PlannedDay
  // Os dias da semana, para mudar uma sessão de dia.
  week: PlannedDay[]
  range: HourRange
  today: string
  now: number
}

export function DayColumn({ day, week, range, today, now }: DayColumnProps) {
  const { isToday, isPast, stretch, showNow, blockIsPast } = columnState(day, range, today, now)
  const drop = useGridDrop(day.date, range, !isPast)

  return (
    <div
      {...drop.handlers}
      className={joinClasses(
        'grid flex-1 grid-cols-8 planner-rows',
        isToday && 'rounded-b-control border-x border-b border-action/50',
        drop.isOver && 'bg-action/10',
      )}
    >
      <div aria-hidden="true" className={joinClasses('col-span-full row-start-1', `row-span-${rowCount(range)}`)} />
      {gridLineHours(range).map((hour) => (
        <div key={hour} aria-hidden="true" className={joinClasses('col-span-full border-t border-line', `row-start-${hourRow(hour, range)} row-span-24`)} />
      ))}
      {stretch && <FreeStretchLabel start={stretch.start} end={stretch.end} label={stretch.label} range={range} />}
      {layoutDay(day.blocks ?? [], range).map((item) => (
        <PlannerBlock
          key={`${item.block.taskId}-${item.block.start}`}
          placed={item}
          date={day.date}
          dates={movableDates(week, item.block.taskId, day.date, today)}
          isPast={blockIsPast(item.block.end)}
        />
      ))}
      {showNow && <NowLine now={now} range={range} />}
      {drop.failed && (
        <p role="alert" className="sr-only">
          Não deu para encaixar a tarefa.
        </p>
      )}
    </div>
  )
}

function columnState(day: PlannedDay, range: HourRange, today: string, now: number) {
  const isToday = day.date === today
  const isPast = day.date < today
  return {
    isToday,
    isPast,
    stretch: isPast ? undefined : freeStretch(day, range, isToday ? now : 0),
    showNow: isToday && now >= range.startHour * 60 && now < range.endHour * 60,
    blockIsPast: (end: string) => isPast || (isToday && minutesOfDay(end) <= now),
  }
}

function gridLineHours(range: HourRange) {
  return Array.from({ length: Math.ceil((range.endHour - range.startHour) / 2) }, (_, index) => range.startHour + index * 2)
}

type FreeStretchLabelProps = {
  start: number
  end: number
  label: string
  range: HourRange
}

function FreeStretchLabel({ start, end, label, range }: FreeStretchLabelProps) {
  const { rowStart, rowSpan } = rowPlacement(start, end, range)
  return (
    <p className={joinClasses('col-span-full flex items-center justify-center px-1 text-center type-section text-ink-muted', `row-start-${rowStart} row-span-${rowSpan}`)}>
      {label}
    </p>
  )
}

type NowLineProps = {
  now: number
  range: HourRange
}

function NowLine({ now, range }: NowLineProps) {
  const { rowStart } = rowPlacement(now, now + 5, range)
  return (
    <div aria-hidden="true" className={joinClasses('z-50 col-span-full flex items-center self-start', `row-start-${rowStart}`)}>
      <span className="-ml-1 size-2 shrink-0 rounded-full bg-ink" />
      <span className="h-0.5 flex-1 bg-ink" />
    </div>
  )
}
