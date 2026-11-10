import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { isSameWeek } from '@/shared/time/week'
import { useHabits, useWeekProgress } from '../api/progressQueries'
import { rhythmsOnTrack } from '../habitRhythm'

export function useOverview() {
  const now = useNow()
  const week = useWeekParam(now)
  const habits = useHabits(week.iso)
  const progress = useWeekProgress(week.iso)
  const habitList = habits.data?.habits ?? []
  const oneOff = progress.data?.oneOff ?? []
  const loaded = habits.isSuccess && progress.isSuccess

  return {
    now,
    week,
    habits,
    habitList,
    oneOff,
    today: toIsoDate(now),
    isCurrentWeek: isSameWeek(week.start, now),
    onTrack: habits.isSuccess ? rhythmsOnTrack(habitList, week.iso) : undefined,
    isPending: habits.isPending || progress.isPending,
    isEmpty: loaded && habitList.length + oneOff.length === 0,
    hasContent: loaded && habitList.length + oneOff.length > 0,
  }
}
