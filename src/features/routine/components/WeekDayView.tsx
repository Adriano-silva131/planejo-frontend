import { Lock } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, weekdayInitial } from '@/shared/time/dateLabels'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { RoutineDay } from '../api/routineTypes'
import { blockTimeLabel } from '../blockTime'

export type WeekDayViewProps = {
  days: RoutineDay[]
  today: string
}

export function WeekDayView({ days, today }: WeekDayViewProps) {
  const [params, setParams] = useSearchParams()
  const selected = days.find((day) => day.date === params.get('dia')) ?? days.find((day) => day.date === today) ?? days[0]
  const select = (date: string) =>
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.set('dia', date)
      return next
    })

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Dia da semana" className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <DayButton key={day.date} day={day} isSelected={day.date === selected.date} isToday={day.date === today} onSelect={select} />
        ))}
      </div>
      <h2 className="type-section first-letter:uppercase">{longDateLabel(fromIsoDate(selected.date))}</h2>
      <DayBlocks day={selected} />
    </div>
  )
}

type DayButtonProps = {
  day: RoutineDay
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
        'flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-control type-meta tabular-nums focus-visible:outline-2 focus-visible:outline-accent',
        isSelected ? 'bg-action text-on-action' : 'text-ink hover:bg-ink/5',
        isToday && !isSelected && 'text-accent',
      )}
    >
      <span>{weekdayInitial(date)}</span>
      <span className="type-label">{date.getDate()}</span>
    </button>
  )
}

type DayBlocksProps = {
  day: RoutineDay
}

function DayBlocks({ day }: DayBlocksProps) {
  const blocks = day.blocks ?? []
  if (blocks.length === 0) return <p className="text-ink-muted">Nada fixo neste dia. Uma pausa também conta.</p>

  return (
    <ol className="flex flex-col gap-3">
      {blocks.map((block) => (
        <li key={`${block.taskId}-${block.start}`} className="flex gap-3">
          <span className="w-12 shrink-0 pt-3 type-meta tabular-nums text-ink-muted">{block.start}</span>
          <div data-category={areaCategoryId(block.area)} className="flex-1 rounded-control border-l-4 border-hue-line bg-hue p-3 text-on-hue">
            <div className="flex items-start justify-between gap-2">
              <p className="type-label">{block.title}</p>
              <Lock aria-hidden="true" className="mt-1 size-4 shrink-0" />
            </div>
            <p className="type-meta tabular-nums">
              {block.area} · {blockTimeLabel(block)}
            </p>
            {block.adjusted && <p className="type-meta opacity-80">Ajustado nesta semana</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
