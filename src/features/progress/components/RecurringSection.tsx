import { SegmentMeter } from '@/shared/ui/SegmentMeter'
import type { RecurringProgress } from '../api/progressTypes'
import { CheckInButton } from './CheckInButton'

export type RecurringSectionProps = {
  items: RecurringProgress[]
  today: string
  canCheckIn: boolean
}

export function RecurringSection({ items, today, canCheckIn }: RecurringSectionProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="recurring-title" className="flex flex-col gap-3">
      <h2 id="recurring-title" className="type-section">
        Recorrentes
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.taskId} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="type-label">{item.title}</p>
              <p className="shrink-0 type-meta tabular-nums text-ink-muted">
                {item.done} de {item.expected}
              </p>
            </div>
            <SegmentMeter
              filled={Math.min(item.done, item.expected)}
              total={Math.max(item.expected, 1)}
              label={`${item.done} de ${item.expected} vezes nesta semana`}
            />
            {canCheckIn && <CheckInButton taskId={item.taskId} date={today} done={(item.days ?? []).includes(today)} />}
          </li>
        ))}
      </ul>
    </section>
  )
}
