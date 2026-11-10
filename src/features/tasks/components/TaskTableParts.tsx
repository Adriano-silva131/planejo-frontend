import { joinClasses } from '@/shared/ui/joinClasses'
import type { Priority, Weekday } from '../api/taskTypes'
import { priorityLabels, weekdayOrder, weekdayShort } from '../taskLabels'
import { weekdaysLabel } from '../taskSummary'

export type WeekdayDotsProps = {
  days: readonly Weekday[]
}

// Os dias marcados usam a cor da área do elemento com data-category mais próximo.
export function WeekdayDots({ days }: WeekdayDotsProps) {
  return (
    <div className="flex gap-1">
      <span className="sr-only">{weekdaysLabel(days)}</span>
      {weekdayOrder.map((day) => (
        <span
          key={day}
          aria-hidden="true"
          className={joinClasses(
            'flex size-6 shrink-0 items-center justify-center rounded-full type-eyebrow tracking-normal',
            days.includes(day) ? 'bg-hue-line text-canvas' : 'border border-line text-ink-muted',
          )}
        >
          {weekdayShort[day].charAt(0)}
        </span>
      ))}
    </div>
  )
}

export type PriorityBarsProps = {
  priority: Priority
}

const priorityLevel: Record<Priority, number> = { low: 1, medium: 2, high: 3 }
const barHeights = ['h-1.5', 'h-2.5', 'h-3.5']

export function PriorityBars({ priority }: PriorityBarsProps) {
  return (
    <span className="flex items-center gap-2 type-meta whitespace-nowrap text-ink-muted">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {barHeights.map((height, index) => (
          <span key={height} className={joinClasses('w-1 rounded-full', height, index < priorityLevel[priority] ? 'bg-ink' : 'bg-line')} />
        ))}
      </span>
      {priorityLabels[priority]}
    </span>
  )
}
