import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration } from '@/shared/time/timeOfDay'
import { StackedBar } from '@/shared/ui/StackedBar'
import type { AreaHours } from '../weekSummary'

export type PlannedHoursCardProps = {
  areas: AreaHours[]
  title: string
}

export function PlannedHoursCard({ areas, title }: PlannedHoursCardProps) {
  if (areas.length === 0) return null
  const total = areas.reduce((sum, item) => sum + item.minutes, 0)
  const label = areas.map((item) => `${item.area}: ${formatDuration(item.minutes)}`).join(', ')

  return (
    <section aria-labelledby="planned-hours-title" className="flex flex-col gap-4 rounded-card bg-surface p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="planned-hours-title" className="type-label">
          {title}
        </h2>
        <span className="type-meta tabular-nums text-ink-muted">{formatDuration(total)}</span>
      </div>
      <StackedBar
        label={label}
        segments={areas.map((item) => ({ key: item.area, value: item.minutes, category: areaCategoryId(item.area) }))}
      />
      <ul className="flex flex-col gap-2">
        {areas.map((item) => (
          <li key={item.area} data-category={areaCategoryId(item.area)} className="flex items-center gap-3 type-meta">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
            <span className="min-w-0 flex-1 truncate">{item.area}</span>
            <span className="tabular-nums">{formatDuration(item.minutes)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
