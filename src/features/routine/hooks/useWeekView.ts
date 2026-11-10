import { toIsoDate } from '@/shared/time/calendarDate'
import { minutesSinceMidnight } from '@/shared/time/timeOfDay'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import type { PlannedDay } from '../api/routineTypes'
import { useWeekRoutine } from '../api/useWeekRoutine'
import { visibleHours } from '../weekGrid'
import { dayFree, weekFreeMinutes } from '../weekSummary'

export function useWeekView() {
  const date = useNow()
  const week = useWeekParam(date)
  const routine = useWeekRoutine(week.iso)
  const today = toIsoDate(date)
  const now = minutesSinceMidnight(date)
  const days = (routine.data?.days ?? []) as PlannedDay[]
  const range = visibleHours(days)
  const free = days.map((day) => dayFree(day, range, today, now))

  return {
    week,
    routine,
    days,
    free,
    today,
    now,
    totalFree: routine.isSuccess ? weekFreeMinutes(free) : undefined,
  }
}
