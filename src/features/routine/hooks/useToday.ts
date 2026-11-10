import { toIsoDate } from '@/shared/time/calendarDate'
import { minutesSinceMidnight } from '@/shared/time/timeOfDay'
import { useNow } from '@/shared/time/useNow'
import type { PlannedDay } from '../api/routineTypes'
import { useWeekRoutine } from '../api/useWeekRoutine'
import { todayFree } from '../weekSummary'

export function useToday() {
  const now = useNow()
  const today = toIsoDate(now)
  const routine = useWeekRoutine(today)
  const found = routine.data?.days?.find((item) => item.date === today) as PlannedDay | undefined
  const day: PlannedDay = found ?? { date: today, weekday: '', blocks: [] }

  const week = (routine.data?.days ?? []) as PlannedDay[]
  const freeMinutes = routine.isSuccess ? todayFree(week, today, minutesSinceMidnight(now))?.freeMinutes : undefined

  return { now, today, routine, day, week, freeMinutes }
}
