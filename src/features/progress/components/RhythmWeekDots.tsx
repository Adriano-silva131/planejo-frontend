import { fromIsoDate } from '@/shared/time/calendarDate'
import { shortDateLabel } from '@/shared/time/week'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { HabitWeek } from '../api/progressTypes'

export type RhythmWeekDotsProps = {
  weeks: Array<HabitWeek | undefined>
  ongoing?: string
}

// Ponto cheio: meta cumprida. Anel: semana sem a meta. Anel no acento: semana em andamento. Ponto apagado: a
// tarefa ainda não existia.
export function RhythmWeekDots({ weeks, ongoing }: RhythmWeekDotsProps) {
  return (
    <ol aria-label="Últimas semanas" className="flex gap-1.5">
      {weeks.map((week, index) => (
        <li key={week?.start ?? `empty-${index}`}>
          <span
            aria-hidden="true"
            className={joinClasses('block size-3.5 rounded-full', week ? dotClasses(week, week.start === ongoing) : 'bg-surface-alt')}
          />
          {week && <span className="sr-only">{weekText(week, week.start === ongoing)}</span>}
        </li>
      ))}
    </ol>
  )
}

function dotClasses(week: HabitWeek, isOngoing: boolean) {
  if (week.met) return 'bg-action'
  return isOngoing ? 'border-2 border-action' : 'border border-line'
}

function weekText(week: HabitWeek, isOngoing: boolean) {
  return `Semana de ${shortDateLabel(fromIsoDate(week.start))}${isOngoing ? ', em andamento' : ''}: ${week.done} de ${week.target}`
}
