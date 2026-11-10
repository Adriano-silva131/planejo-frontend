import { useLayoutEffect, useRef } from 'react'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { hourRow, initialScrollHour, rowCount, visibleHours, type HourRange } from '../weekGrid'
import type { DayFree } from '../weekSummary'
import { DayColumn } from './DayColumn'
import { WeekDayHeader } from './WeekDayHeader'

export type WeekGridProps = {
  days: PlannedDay[]
  free: DayFree[]
  today: string
  now: number
}

export function WeekGrid({ days, free, today, now }: WeekGridProps) {
  const range = visibleHours(days)
  const scroller = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const isCurrentWeek = days.some((day) => day.date === today)
  const scrollHour = initialScrollHour(range, isCurrentWeek ? Math.floor(now / 60) : undefined)
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
    <div className="rounded-card bg-surface p-3">
      <div ref={scroller} className="relative planner-viewport overflow-y-auto overscroll-contain">
        <div ref={header} className="sticky top-0 z-50 flex gap-1 bg-surface">
          <div className="w-10 shrink-0" />
          {free.map((day) => (
            <WeekDayHeader key={day.date} free={day} isToday={day.date === today} />
          ))}
        </div>
        <div className="flex gap-1">
          <HourAxis range={range} />
          {days.map((day) => (
            <DayColumn key={day.date} day={day} week={days} range={range} today={today} now={now} />
          ))}
        </div>
      </div>
    </div>
  )
}

type HourAxisProps = {
  range: HourRange
}

function HourAxis({ range }: HourAxisProps) {
  const hours = Array.from({ length: range.endHour - range.startHour }, (_, index) => range.startHour + index)
  return (
    <div aria-hidden="true" className="grid w-10 shrink-0 planner-rows">
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
