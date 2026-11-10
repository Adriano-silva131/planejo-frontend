import type { Ref } from 'react'
import { columnMode } from '../weekColumns'
import type { HourRange } from '../weekGrid'
import type { DayFree } from '../weekSummary'
import { OpenDayHeader } from './OpenDayHeader'
import { WeekDayHeader } from './WeekDayHeader'

export type WeekGridHeaderProps = {
  ref: Ref<HTMLDivElement>
  free: DayFree[]
  today: string
  range: HourRange
  openDate?: string
  onOpen: (date: string) => void
  onClose: () => void
}

export function WeekGridHeader({ ref, free, today, range, openDate, onOpen, onClose }: WeekGridHeaderProps) {
  return (
    <div ref={ref} className="sticky top-0 z-60 flex gap-1 bg-surface">
      <div className="w-10 shrink-0" />
      {free.map((day) =>
        columnMode(day.date, openDate) === 'open' ? (
          <OpenDayHeader key={day.date} free={day} isToday={day.date === today} endHour={range.endHour} onClose={onClose} />
        ) : (
          <WeekDayHeader key={day.date} free={day} isToday={day.date === today} collapsed={openDate !== undefined} onOpen={onOpen} />
        ),
      )}
    </div>
  )
}
