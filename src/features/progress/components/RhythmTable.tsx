import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import { SegmentMeter } from '@/shared/ui/SegmentMeter'
import type { Habit, HabitWeek } from '../api/progressTypes'
import { habitRhythm, shownWeeks } from '../habitRhythm'
import { CheckInDaysButton } from './CheckInDaysButton'
import { CheckInToggle } from './CheckInToggle'
import { RhythmWeekDots } from './RhythmWeekDots'

export type RhythmTableProps = {
  habits: Habit[]
  weekStart: string
  today: string
  canCheckIn: boolean
}

const columnClasses = {
  rhythm: 'w-1/5 pr-4',
  week: 'w-1/5 pr-4',
  history: 'w-1/5 pr-4',
  streak: 'w-3/20 pr-4 whitespace-nowrap',
  action: 'w-1/4 text-right',
}

const headClasses = 'pb-3 text-left type-eyebrow font-bold text-ink-muted'

export function RhythmTable({ habits, weekStart, today, canCheckIn }: RhythmTableProps) {
  return (
    <section aria-label="Ritmos" className="rounded-card bg-surface p-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-2xl table-fixed border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={joinClasses(headClasses, columnClasses.rhythm)}>
                Ritmo
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.week)}>
                Esta semana
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.history)}>
                Últimas {shownWeeks} semanas
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.streak)}>
                Sequência
              </th>
              <th scope="col" className={columnClasses.action}>
                <span className="sr-only">Registrar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <RhythmRow key={habit.taskId} habit={habit} weekStart={weekStart} today={today} canCheckIn={canCheckIn} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type RhythmRowProps = {
  habit: Habit
  weekStart: string
  today: string
  canCheckIn: boolean
}

function RhythmRow({ habit, weekStart, today, canCheckIn }: RhythmRowProps) {
  const { week, weeks, status, doneToday } = habitRhythm(habit, weekStart, today)

  return (
    <tr data-category={areaCategoryId(habit.area)} className="border-b border-line last:border-b-0">
      <td className={joinClasses('py-3', columnClasses.rhythm)}>
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-hue-line" />
          <div className="min-w-0">
            <p className="truncate type-label">{habit.title}</p>
            <p className="type-meta text-ink-muted">{`${habit.timesPerWeek}× por semana · ${status}`}</p>
          </div>
        </div>
      </td>
      <td className={joinClasses('py-3', columnClasses.week)}>{week && week.target > 0 && <WeekMeter week={week} />}</td>
      <td className={joinClasses('py-3', columnClasses.history)}>
        <RhythmWeekDots weeks={weeks} ongoing={canCheckIn ? weekStart : undefined} />
      </td>
      <td className={joinClasses('py-3 type-control tabular-nums', columnClasses.streak)}>
        {habit.streak > 0 ? `${habit.streak} sem.` : <span className="text-ink-muted">—</span>}
      </td>
      <td className={joinClasses('py-3', columnClasses.action)}>
        <CheckInActions habit={habit} week={week} today={today} canCheckIn={canCheckIn} doneToday={doneToday} />
      </td>
    </tr>
  )
}

type CheckInActionsProps = {
  habit: Habit
  week?: HabitWeek
  today: string
  canCheckIn: boolean
  doneToday: boolean
}

// "Feito hoje" some quando a meta da semana foi cumprida; os outros dias continuam ao alcance para corrigir.
function CheckInActions({ habit, week, today, canCheckIn, doneToday }: CheckInActionsProps) {
  const daysSoFar = (week?.days ?? []).filter((day) => day.date <= today)
  return (
    <div className="flex items-start justify-end gap-1">
      {canCheckIn && (doneToday || !week?.met) && <CheckInToggle taskId={habit.taskId} date={today} done={doneToday} />}
      {daysSoFar.length > 0 && <CheckInDaysButton taskId={habit.taskId} title={habit.title} days={daysSoFar} />}
    </div>
  )
}

type WeekMeterProps = {
  week: HabitWeek
}

function WeekMeter({ week }: WeekMeterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <SegmentMeter filled={Math.min(week.done, week.target)} total={week.target} label={`${week.done} de ${week.target} nesta semana`} />
      </div>
      <span aria-hidden="true" className={joinClasses('type-meta tabular-nums', week.met ? 'font-bold text-action' : 'text-ink-muted')}>
        {week.done}/{week.target}
      </span>
    </div>
  )
}
