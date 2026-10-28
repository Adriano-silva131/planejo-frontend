import { joinClasses } from '@/shared/ui/joinClasses'
import type { RoutineDay } from '../api/routineTypes'
import { hourRow, layoutDay, rowCount, type HourRange } from '../weekGrid'
import { PlannerBlock } from './PlannerBlock'

export type DayColumnProps = {
  day: RoutineDay
  range: HourRange
  isToday: boolean
}

export function DayColumn({ day, range, isToday }: DayColumnProps) {
  const placed = layoutDay(day.blocks ?? [], range)
  const hours = Array.from({ length: range.endHour - range.startHour }, (_, index) => range.startHour + index)

  return (
    <div className={joinClasses('grid flex-1 grid-cols-8 planner-rows border-l border-line', isToday && 'bg-peach/10')}>
      <div aria-hidden="true" className={joinClasses('col-span-full row-start-1', `row-span-${rowCount(range)}`)} />
      {hours.map((hour) => (
        <div
          key={hour}
          aria-hidden="true"
          className={joinClasses('col-span-full border-t border-line/60', `row-start-${hourRow(hour, range)} row-span-12`)}
        />
      ))}
      {placed.map((item) => (
        <PlannerBlock key={`${item.block.taskId}-${item.block.start}`} placed={item} />
      ))}
    </div>
  )
}
