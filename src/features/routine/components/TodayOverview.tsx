import { useMemo } from 'react'
import { areaCategoryColors } from '@/shared/theme/areaColors'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import { toIsoDate } from '@/shared/time/calendarDate'
import { minutesSinceMidnight } from '@/shared/time/timeOfDay'
import type { RoutineWeek } from '../api/routineTypes'
import { planDay } from '../dayPlan'
import { CurrentBlockCard } from './CurrentBlockCard'
import { FreeTimeCard } from './FreeTimeCard'
import { RestOfDayTimeline } from './RestOfDayTimeline'
import { WeekStrip } from './WeekStrip'

export type TodayOverviewProps = {
  week: RoutineWeek
  now: Date
}

export function TodayOverview({ week, now }: TodayOverviewProps) {
  const today = toIsoDate(now)
  const blocks = week.days?.find((day) => day.date === today)?.blocks ?? []
  const plan = planDay(blocks, minutesSinceMidnight(now))
  const categories = useMemo(
    () => areaCategoryColors((week.days ?? []).flatMap((day) => (day.blocks ?? []).map((block) => block.area))),
    [week],
  )
  useCategoryColors(categories)

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <CurrentBlockCard plan={plan} hasBlocksToday={blocks.length > 0} className="lg:col-span-2 lg:row-start-1" />
      <RestOfDayTimeline blocks={plan.rest} className="lg:col-span-2 lg:row-start-2" />
      <FreeTimeCard freeMinutes={plan.freeMinutes} className="lg:col-start-3 lg:row-start-1" />
      <WeekStrip week={week} today={today} className="lg:col-start-3 lg:row-start-2" />
    </div>
  )
}
