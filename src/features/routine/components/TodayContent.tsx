import type { ReactNode } from 'react'
import { minutesOfDay, minutesSinceMidnight } from '@/shared/time/timeOfDay'
import type { PlannedDay } from '../api/routineTypes'
import { blockKey, dayItems, nextBreak } from '../dayItems'
import { planDay } from '../dayPlan'
import { BreatherCard } from './BreatherCard'
import { DayLine } from './DayLine'
import { LaterList } from './LaterList'
import { NowCard } from './NowCard'

export type TodayContentProps = {
  day: PlannedDay
  week: PlannedDay[]
  now: Date
  aside?: ReactNode
}

export function TodayContent({ day, week, now, aside }: TodayContentProps) {
  const minutes = minutesSinceMidnight(now)
  const blocks = day.blocks ?? []
  const plan = planDay(blocks, minutes)
  const items = dayItems(day)
  const highlightKey = plan.highlight && blockKey(plan.highlight.block)
  const later = items.filter((item) => item.end > minutes && item.key !== highlightKey)
  const freeFrom = Math.max(minutes, plan.highlight ? minutesOfDay(plan.highlight.block.end) : 0)

  return (
    <div className="flex flex-col gap-4">
      <DayLine items={items} now={minutes} />
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <NowCard plan={plan} now={minutes} hasBlocksToday={blocks.length > 0} />
          <LaterList items={later} date={day.date} week={week} freeFrom={freeFrom} />
        </div>
        <div className="flex flex-col gap-4">
          <BreatherCard gap={nextBreak(items, minutes)} now={minutes} />
          {aside}
        </div>
      </div>
    </div>
  )
}

