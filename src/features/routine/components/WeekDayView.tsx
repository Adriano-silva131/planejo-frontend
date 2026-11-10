import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, weekdayInitial } from '@/shared/time/dateLabels'
import { timeOfDayLabel } from '@/shared/time/timeOfDay'
import { useDayParam } from '@/shared/time/useDayParam'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { dayItems } from '../dayItems'
import { movableDates } from '../sessionForm'
import { BlockRow } from './LaterItem'

export type WeekDayViewProps = {
  days: PlannedDay[]
  today: string
}

export function WeekDayView({ days, today }: WeekDayViewProps) {
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
      <DayBlocks day={selected} week={days} today={today} />
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

type DayBlocksProps = {
  day: PlannedDay
  week: PlannedDay[]
  today: string
}

function DayBlocks({ day, week, today }: DayBlocksProps) {
  const items = dayItems(day)
  if (items.length === 0) return <p className="text-ink-muted">Nada marcado neste dia. Uma pausa também conta.</p>

  return (
    <ol className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.key} className="flex gap-3">
          <span className="w-12 shrink-0 pt-3 type-meta tabular-nums text-ink-muted">{timeOfDayLabel(item.start)}</span>
          <div className="min-w-0 flex-1">
            <BlockRow block={item.block} date={day.date} dates={movableDates(week, item.block.taskId, day.date, today)} />
          </div>
        </li>
      ))}
    </ol>
  )
}
