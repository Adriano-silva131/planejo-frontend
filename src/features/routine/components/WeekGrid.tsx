import { useLayoutEffect, useRef } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { RoutineDay } from '../api/routineTypes'
import { hourRow, initialScrollHour, rowCount, visibleHours, type HourRange } from '../weekGrid'
import { DayColumn } from './DayColumn'

export type WeekGridProps = {
  days: RoutineDay[]
  today: string
  nowHour?: number
}

export function WeekGrid({ days, today, nowHour }: WeekGridProps) {
  const range = visibleHours(days)
  const scroller = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const scrollHour = initialScrollHour(range, nowHour)
  const weekStart = days[0]?.date
  const scrolledWeek = useRef<string>(undefined)

  // Rola até perto da hora atual ao abrir ou trocar de semana; a virada de hora não tira o usuário de onde ele está.
  useLayoutEffect(() => {
    if (scrolledWeek.current === weekStart) return
    const target = scroller.current?.querySelector<HTMLElement>(`[data-hour="${scrollHour}"]`)
    if (!scroller.current || !target) return
    scroller.current.scrollTop = target.offsetTop - (header.current?.offsetHeight ?? 0)
    scrolledWeek.current = weekStart
  }, [scrollHour, weekStart])

  return (
    <div className="overflow-hidden rounded-card border border-line bg-calendar">
      <div ref={scroller} className="relative planner-viewport overflow-y-auto overscroll-contain">
        <div ref={header} className="sticky top-0 z-50 flex border-b border-line bg-calendar">
          <div className="w-16 shrink-0" />
          {days.map((day) => (
            <DayHeader key={day.date} date={day.date} isToday={day.date === today} />
          ))}
        </div>
        <div className="flex">
          <HourAxis range={range} />
          {days.map((day) => (
            <DayColumn key={day.date} day={day} range={range} isToday={day.date === today} />
          ))}
        </div>
      </div>
    </div>
  )
}

type DayHeaderProps = {
  date: string
  isToday: boolean
}

function DayHeader({ date, isToday }: DayHeaderProps) {
  const value = fromIsoDate(date)
  return (
    <div className={joinClasses('flex flex-1 flex-col items-center gap-1 border-l border-line py-3', isToday && 'bg-peach/20')}>
      <span aria-hidden="true" className="type-meta text-ink-muted">
        {shortWeekdayLabel(value)}
      </span>
      <span
        aria-hidden="true"
        className={joinClasses(
          'flex size-9 items-center justify-center rounded-full type-label tabular-nums',
          isToday && 'bg-action text-on-action',
        )}
      >
        {value.getDate()}
      </span>
      <span className="sr-only">{`${longDateLabel(value)}${isToday ? ', hoje' : ''}`}</span>
    </div>
  )
}

type HourAxisProps = {
  range: HourRange
}

function HourAxis({ range }: HourAxisProps) {
  const hours = Array.from({ length: range.endHour - range.startHour }, (_, index) => range.startHour + index)
  return (
    <div aria-hidden="true" className="grid w-16 shrink-0 planner-rows">
      <div className={joinClasses('row-start-1', `row-span-${rowCount(range)}`)} />
      {hours.map((hour) => (
        <span
          key={hour}
          data-hour={hour}
          className={joinClasses('col-start-1 pt-1 pr-2 text-right type-meta tabular-nums text-ink-muted', `row-start-${hourRow(hour, range)} row-span-12`)}
        >
          {`${String(hour).padStart(2, '0')}:00`}
        </span>
      ))}
    </div>
  )
}
