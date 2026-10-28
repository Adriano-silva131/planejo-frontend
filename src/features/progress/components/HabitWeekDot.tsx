import { fromIsoDate } from '@/shared/time/calendarDate'
import { shortDateLabel } from '@/shared/time/week'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { HabitWeek } from '../api/progressTypes'

export type HabitWeekDotProps = {
  week: HabitWeek
  ongoing: boolean
}

// Semana fechada: ponto cheio ou apagado. Semana em andamento ainda não cumprida: anel que enche a cada vez feita.
export function HabitWeekDot({ week, ongoing }: HabitWeekDotProps) {
  const label = `Semana de ${shortDateLabel(fromIsoDate(week.start))}${ongoing ? ', em andamento' : ''}: ${week.done} de ${week.target}`

  return (
    <>
      {ongoing && !week.met ? (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="block size-3.5 -rotate-90">
          <circle cx="8" cy="8" r="6" fill="none" strokeWidth="3" className="stroke-ink/10" />
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            strokeWidth="3"
            pathLength={week.target}
            strokeDasharray={`${week.done} ${week.target}`}
            className="stroke-accent"
          />
        </svg>
      ) : (
        <span aria-hidden="true" className={joinClasses('block size-3.5 rounded-full', week.met ? 'bg-accent' : 'bg-ink/10')} />
      )}
      <span className="sr-only">{label}</span>
    </>
  )
}
