import type { ReactNode } from 'react'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import type { PlannedDay } from '../api/routineTypes'
import type { DayItem } from '../dayItems'
import { movableDates } from '../sessionForm'
import { BlockRow } from './LaterItem'

export type LaterListProps = {
  items: DayItem[]
  date: string
  // Os dias da semana, para mudar uma sessão de dia.
  week: PlannedDay[]
  freeFrom: number
}

const eveningStart = 18 * 60

export function LaterList({ items, date, week, freeFrom }: LaterListProps) {
  const lastEnd = Math.max(freeFrom, ...items.map((item) => item.end))

  return (
    <section aria-labelledby="later-title">
      <h2 id="later-title" className="border-b border-line pb-3 type-label">
        Depois
      </h2>
      <ol>
        {items.map((item) => (
          <Row key={item.key} time={`${timeOfDayLabel(item.start)} – ${timeOfDayLabel(item.end)}`}>
            <BlockRow block={item.block} date={date} dates={movableDates(week, item.block.taskId, date, date)} />
          </Row>
        ))}
        {lastEnd < minutesInDay && (
          <Row time={`${timeOfDayLabel(lastEnd)} →`}>
            <p className="type-section text-ink-muted">{lastEnd >= eveningStart ? 'Noite livre.' : 'Resto do dia livre.'}</p>
          </Row>
        )}
      </ol>
    </section>
  )
}

type RowProps = {
  time: string
  children: ReactNode
}

function Row({ time, children }: RowProps) {
  return (
    <li className="flex flex-col gap-2 border-b border-line py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
      <span className="shrink-0 type-meta tabular-nums text-ink-muted sm:w-28">{time}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  )
}
