import { useWeekProgress } from '@/features/progress/api/progressQueries'
import { OverviewPage } from '@/features/progress/pages/OverviewPage'
import { useWeekRoutine } from '@/features/routine/api/useWeekRoutine'
import { useTasks } from '@/features/tasks/api/taskQueries'
import { toIsoDate } from '@/shared/time/calendarDate'
import { minutesSinceMidnight } from '@/shared/time/timeOfDay'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { isSameWeek } from '@/shared/time/week'
import { AreaTimeCard } from './overview/AreaTimeCard'
import { DayTimeCard } from './overview/DayTimeCard'
import { areaTimes, dayTimes } from './overview/weekTime'

// Os cards de tempo cruzam rotina, progresso e tarefas, por isso são montados aqui.
export function OverviewRoute() {
  const now = useNow()
  const week = useWeekParam(now)
  const routine = useWeekRoutine(week.iso)
  const progress = useWeekProgress(week.iso)
  const tasks = useTasks(1)
  const today = toIsoDate(now)

  if (!routine.isSuccess || !progress.isSuccess || !tasks.isSuccess) return <OverviewPage />
  const input = { days: routine.data.days ?? [], progress: progress.data, tasks: tasks.data.data ?? [], today, now: minutesSinceMidnight(now) }
  const isFuture = week.iso > today
  const period = isSameWeek(week.start, now) ? 'Seg a hoje' : 'Seg a dom'

  return (
    <OverviewPage
      areaTime={isFuture ? undefined : <AreaTimeCard areas={areaTimes(input)} period={period} />}
      dayTime={<DayTimeCard days={dayTimes(input)} today={today} />}
    />
  )
}
