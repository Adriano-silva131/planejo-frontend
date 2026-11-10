import type { KeyboardEvent } from 'react'
import { FormAlert } from '@/shared/ui/FormAlert'
import type { PlannedDay } from '../api/routineTypes'
import { useGridPlacement } from '../hooks/useGridPlacement'
import { useGridScroll } from '../hooks/useGridScroll'
import { useOpenDayFocus } from '../hooks/useOpenDayFocus'
import { columnMode, rowsClass } from '../weekColumns'
import { dayScrollHour, initialScrollHour, visibleHours, type HourRange } from '../weekGrid'
import type { DayFree } from '../weekSummary'
import { DayColumn } from './DayColumn'
import { HourAxis } from './HourAxis'
import { WeekGridHeader } from './WeekGridHeader'

export type WeekGridProps = {
  days: PlannedDay[]
  free: DayFree[]
  today: string
  now: number
  // Dia aberto na grade; sem ele, a visão geral da semana.
  openDate?: string
  onOpen: (date: string) => void
  onClose: () => void
}

export function WeekGrid({ days, free, today, now, openDate, onOpen, onClose }: WeekGridProps) {
  const range = visibleHours(days)
  const { scroller, header } = useGridScroll(scrollHour(days, range, { today, now, openDate }), `${days[0]?.date}|${openDate ?? ''}`)
  const placement = useGridPlacement()
  const alert = placement.alert && days.some((day) => day.date === placement.alert?.date) ? placement.alert : undefined
  const rows = rowsClass(openDate)
  useOpenDayFocus(openDate)

  // Esc fecha o dia aberto, a não ser que venha de um diálogo aberto dentro da grade, que fecha sozinho.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !openDate || (event.target as Element).closest('dialog')) return
    onClose()
  }

  return (
    <div onKeyDown={onKeyDown} className="flex flex-col gap-3 rounded-card bg-surface p-3">
      {alert && <FormAlert onDismiss={placement.dismiss}>{alert.message}</FormAlert>}
      <div ref={scroller} className="relative planner-viewport overflow-y-auto overscroll-contain">
        <WeekGridHeader ref={header} free={free} today={today} range={range} openDate={openDate} onOpen={onOpen} onClose={onClose} />
        <div className="flex gap-1">
          <HourAxis range={range} rowsClass={rows} />
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
              mode={columnMode(day.date, openDate)}
              rowsClass={rows}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type ScrollMoment = { today: string; now: number; openDate?: string }

function scrollHour(days: PlannedDay[], range: HourRange, { today, now, openDate }: ScrollMoment) {
  const openDay = days.find((day) => day.date === openDate)
  if (openDay) return dayScrollHour(openDay, range, today, Math.floor(now / 60))
  const isCurrentWeek = days.some((day) => day.date === today)
  return initialScrollHour(range, isCurrentWeek ? Math.floor(now / 60) : undefined)
}
