import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration } from '@/shared/time/timeOfDay'
import { StackedBar } from '@/shared/ui/StackedBar'
import type { AreaTime } from './weekTime'

export type AreaTimeCardProps = {
  areas: AreaTime[]
  period: string
}

export function AreaTimeCard({ areas, period }: AreaTimeCardProps) {
  const total = areas.reduce((sum, item) => sum + item.minutes, 0)
  if (areas.length === 0) return null

  return (
    <section aria-labelledby="area-time-title" className="flex flex-col gap-4 rounded-card bg-surface p-5">
      <div>
        <h2 id="area-time-title" className="type-label">
          Onde foi seu tempo
        </h2>
        <p className="type-meta text-ink-muted">{`${period} · ${total > 0 ? `${formatDuration(total)} feitas` : 'nada feito ainda'}`}</p>
      </div>
      {total > 0 && (
        <StackedBar
          label={areas.map((item) => `${item.area}: ${formatDuration(item.minutes)}`).join(', ')}
          segments={areas.map((item) => ({ key: item.area, value: item.minutes, category: areaCategoryId(item.area) }))}
        />
      )}
      <ul className="flex flex-col gap-2">
        {areas.map((item) => (
          <li key={item.area} data-category={areaCategoryId(item.area)} className="flex items-center gap-3 type-meta">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
            <span className={item.minutes > 0 ? 'min-w-0 flex-1 truncate' : 'min-w-0 flex-1 truncate text-ink-muted'}>{item.area}</span>
            <span className="font-bold tabular-nums">{item.minutes > 0 ? formatDuration(item.minutes) : '0 h'}</span>
            <span className="w-10 text-right tabular-nums text-ink-muted">
              {item.minutes > 0 && total > 0 ? `${Math.round((item.minutes / total) * 100)}%` : '—'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
