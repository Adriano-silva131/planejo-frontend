import { FormAlert } from '@/shared/ui/FormAlert'
import type { PlannedDay } from '../api/routineTypes'
import { useGridPlacement } from '../hooks/useGridPlacement'
import { useGridScroll } from '../hooks/useGridScroll'
import { initialScrollHour, visibleHours } from '../weekGrid'
import type { DayFree } from '../weekSummary'
import { DayColumn } from './DayColumn'
import { HourAxis } from './HourAxis'
import { WeekDayHeader } from './WeekDayHeader'

export type WeekGridProps = {
  days: PlannedDay[]
  free: DayFree[]
  today: string
  now: number
}

export function WeekGrid({ days, free, today, now }: WeekGridProps) {
  const range = visibleHours(days)
  const isCurrentWeek = days.some((day) => day.date === today)
  const { scroller, header } = useGridScroll(initialScrollHour(range, isCurrentWeek ? Math.floor(now / 60) : undefined), days[0]?.date)
  const placement = useGridPlacement()
  const alert = placement.alert && days.some((day) => day.date === placement.alert?.date) ? placement.alert : undefined

  return (
    <div className="flex flex-col gap-3 rounded-card bg-surface p-3">
      {alert && <FormAlert onDismiss={placement.dismiss}>{alert.message}</FormAlert>}
      <div ref={scroller} className="relative planner-viewport overflow-y-auto overscroll-contain">
        <div ref={header} className="sticky top-0 z-60 flex gap-1 bg-surface">
          <div className="w-10 shrink-0" />
          {free.map((day) => (
            <WeekDayHeader key={day.date} free={day} isToday={day.date === today} />
          ))}
        </div>
        <div className="flex gap-1">
          <HourAxis range={range} rowsClass="planner-rows" />
          {days.map((day) => (
            <DayColumn
              key={day.date}
              day={day}
              week={days}
              range={range}
              today={today}
              now={now}
              onPlace={placement.place}
              pending={placement.pendingDate === day.date}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
