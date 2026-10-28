import { CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { formatDuration } from '@/shared/time/timeOfDay'
import { shortDateLabel } from '@/shared/time/week'
import { Button } from '@/shared/ui/Button'
import { SegmentMeter } from '@/shared/ui/SegmentMeter'
import type { OneOffProgress } from '../api/progressTypes'
import { filledSegments, meterSegments } from '../progressMath'
import { LogTimeDialog } from './LogTimeDialog'

export type OneOffSectionProps = {
  items: OneOffProgress[]
  today: string
  canCheckIn: boolean
}

export function OneOffSection({ items, today, canCheckIn }: OneOffSectionProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="one-off-title" className="flex flex-col gap-3">
      <h2 id="one-off-title" className="type-section">
        Pontuais
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <OneOffCard key={item.taskId} item={item} today={today} canCheckIn={canCheckIn} />
        ))}
      </ul>
    </section>
  )
}

type OneOffCardProps = {
  item: OneOffProgress
  today: string
  canCheckIn: boolean
}

function OneOffCard({ item, today, canCheckIn }: OneOffCardProps) {
  const [logging, setLogging] = useState(false)
  const progress = `${formatDuration(item.doneMinutes)} de ${formatDuration(item.totalMinutes)}`

  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-label">{item.title}</p>
          <p className="type-meta text-ink-muted">até {shortDateLabel(fromIsoDate(item.deadline))}</p>
        </div>
        <p className="shrink-0 type-meta tabular-nums text-ink-muted">{progress}</p>
      </div>
      <SegmentMeter filled={filledSegments(item.doneMinutes, item.totalMinutes)} total={meterSegments} label={progress} />
      {item.completedOn ? (
        <p className="inline-flex items-center gap-1.5 type-control text-accent">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          Concluída em {shortDateLabel(fromIsoDate(item.completedOn))}
        </p>
      ) : (
        canCheckIn && (
          <Button variant="secondary" className="self-start" onClick={() => setLogging(true)}>
            <Clock aria-hidden="true" className="size-4" />
            Registrar tempo de hoje
          </Button>
        )
      )}
      <LogTimeDialog item={item} date={today} open={logging} onClose={() => setLogging(false)} />
    </li>
  )
}
