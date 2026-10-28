import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, weekdayInitial } from '@/shared/time/dateLabels'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { RoutineDay, RoutineWeek } from '../api/routineTypes'

export type WeekStripProps = {
  week: RoutineWeek
  today: string
  className?: string
}

export function WeekStrip({ week, today, className }: WeekStripProps) {
  return (
    <section aria-labelledby="week-strip-title" className={className}>
      <h2 id="week-strip-title" className="mb-4 type-section">
        Sua semana
      </h2>
      <ol className="grid grid-cols-7 gap-1 text-center">
        {(week.days ?? []).map((day) => (
          <WeekDay key={day.date} day={day} isToday={day.date === today} />
        ))}
      </ol>
      <p className="mt-4 type-meta text-ink-muted">Deixe um espaço para o inesperado.</p>
    </section>
  )
}

type WeekDayProps = {
  day: RoutineDay
  isToday: boolean
}

function WeekDay({ day, isToday }: WeekDayProps) {
  const date = fromIsoDate(day.date)
  const count = day.blocks?.length ?? 0
  const countLabel = count === 0 ? 'nada marcado' : `${count} ${count === 1 ? 'compromisso' : 'compromissos'}`

  return (
    <li className="flex flex-col items-center gap-2">
      <span aria-hidden="true" className="type-meta text-ink-muted">
        {weekdayInitial(date)}
      </span>
      <span
        aria-hidden="true"
        className={joinClasses(
          'flex size-9 items-center justify-center rounded-full type-meta tabular-nums',
          isToday ? 'bg-action text-on-action' : 'text-ink',
        )}
      >
        {date.getDate()}
      </span>
      <span aria-hidden="true" className={joinClasses('size-1.5 rounded-full bg-accent', count === 0 && 'invisible')} />
      <span className="sr-only">{`${longDateLabel(date)}${isToday ? ', hoje' : ''}: ${countLabel}`}</span>
    </li>
  )
}
