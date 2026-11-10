import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { DayTime } from './weekTime'

export type DayTimeCardProps = {
  days: DayTime[]
  today: string
}

// Altura das barras em passos de 8px, até 112px.
const steps = 14

export function DayTimeCard({ days, today }: DayTimeCardProps) {
  const max = Math.max(1, ...days.flatMap((day) => [day.done, day.planned]))
  const height = (minutes: number) => (minutes > 0 ? `h-${Math.max(1, Math.round((minutes / max) * steps)) * 2}` : 'hidden')

  return (
    <section aria-labelledby="day-time-title" className="flex flex-col gap-6 rounded-card bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="day-time-title" className="type-label">
          Como os dias estão
        </h2>
        <ul aria-hidden="true" className="flex items-center gap-4 type-meta text-ink-muted">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-control bg-action" />
            Feito
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-control bg-line" />
            Planejado
          </li>
        </ul>
      </div>
      <ol className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const past = day.date <= today
          const shown = past ? day.done : day.planned
          const date = fromIsoDate(day.date)
          return (
            <li key={day.date} className="flex flex-col gap-3">
              <div aria-hidden="true" className="relative h-28">
                <span className={joinClasses('absolute inset-x-0 bottom-0 rounded-control bg-line', height(day.planned))} />
                {past && <span className={joinClasses('absolute inset-x-0 bottom-0 rounded-control bg-action', height(day.done))} />}
              </div>
              <p className={joinClasses('text-center type-meta tabular-nums', day.date === today ? 'font-bold text-ink' : 'text-ink-muted')}>
                {`${shortWeekdayLabel(date)} · ${shown > 0 ? formatDuration(shown) : 'livre'}`}
              </p>
              <span className="sr-only">
                {`${longDateLabel(date)}: ${formatDuration(day.done)} feitas de ${formatDuration(day.planned)} planejadas`}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
