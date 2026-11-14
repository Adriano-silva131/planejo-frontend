import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, weekdayInitial } from '@/shared/time/dateLabels'
import { useDayParam } from '@/shared/time/useDayParam'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { BoardDayColumn } from './BoardDayColumn'

export type WeekDayViewProps = {
  days: PlannedDay[]
  today: string
  now: number
}

// No celular, um dia por vez: o mesmo dia do quadro, escolhido na fileira da semana.
export function WeekDayView({ days, today, now }: WeekDayViewProps) {
  const day = useDayParam(fromIsoDate(days[0].date))
  const selected = days.find((item) => item.date === day.date) ?? days.find((item) => item.date === today) ?? days[0]
  const select = day.open

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Dia da semana" className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <DayButton key={day.date} day={day} isSelected={day.date === selected.date} isToday={day.date === today} onSelect={select} />
        ))}
      </div>
      <h2 className="type-section first-letter:uppercase">{longDateLabel(fromIsoDate(selected.date))}</h2>
      <BoardDayColumn key={selected.date} day={selected} week={days} today={today} now={now} mode="single" />
    </div>
  )
}

type DayButtonProps = {
  day: PlannedDay
  isSelected: boolean
  isToday: boolean
  onSelect: (date: string) => void
}

function DayButton({ day, isSelected, isToday, onSelect }: DayButtonProps) {
  const date = fromIsoDate(day.date)
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${longDateLabel(date)}${isToday ? ', hoje' : ''}`}
      onClick={() => onSelect(day.date)}
      className={joinClasses(
        'flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-control type-meta tabular-nums focus-visible:outline-2 focus-visible:outline-action',
        isSelected ? 'bg-action text-on-action' : 'text-ink hover:bg-ink/5',
        isToday && !isSelected && 'text-action',
      )}
    >
      <span>{weekdayInitial(date)}</span>
      <span className="type-label">{date.getDate()}</span>
    </button>
  )
}
