import type { ReactNode } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration, timeOfDayLabel } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import { longestGap, type DayItem } from '../dayItems'
import { dayLineRange, hourMarks, place, type DayLineRange } from '../dayLine'
import { DayLineLegend } from './DayLineLegend'

export type DayLineProps = {
  items: DayItem[]
  now: number
}

const minLabeledGap = 120

export function DayLine({ items, now }: DayLineProps) {
  const range = dayLineRange(items)
  const gap = longestGap(items, now)
  const freeLabel = gap && gap.end - gap.start >= minLabeledGap ? `${formatDuration(gap.end - gap.start)} só suas` : undefined

  return (
    <section aria-labelledby="day-line-title" className="flex flex-col gap-3 rounded-card bg-surface px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="day-line-title" className="type-label">
          Seu dia em uma linha
        </h2>
        <DayLineLegend />
      </div>
      <div role="img" aria-label={summary(items, freeLabel)} className={joinClasses('grid gap-y-1.5', `grid-cols-${range.columns}`)}>
        <NowMarker range={range} now={now} />
        <div className="col-span-full row-start-2 h-12 rounded-control bg-surface-alt" />
        {now > range.startHour * 60 && <Span range={range} start={range.startHour * 60} end={now} className="past-hatch rounded-l-control" />}
        {gap && freeLabel && (
          <Span range={range} start={gap.start} end={gap.end} className="flex items-center justify-center type-section text-ink-muted">
            {freeLabel}
          </Span>
        )}
        {items.map((item) => (
          <LineItem key={item.key} item={item} range={range} isPast={item.end <= now} />
        ))}
        <HourMarks range={range} />
      </div>
    </section>
  )
}

type SpanProps = {
  range: DayLineRange
  start: number
  end: number
  className?: string
  category?: string
  children?: ReactNode
}

function Span({ range, start, end, className, category, children }: SpanProps) {
  const { colStart, colSpan } = place(range, start, end)
  return (
    <div data-category={category} className={joinClasses('row-start-2 min-w-0', `col-start-${colStart} col-span-${colSpan}`, className)}>
      {children}
    </div>
  )
}

type LineItemProps = {
  item: DayItem
  range: DayLineRange
  isPast: boolean
}

function LineItem({ item, range, isPast }: LineItemProps) {
  return (
    <Span
      range={range}
      start={item.start}
      end={item.end}
      category={areaCategoryId(item.block.area)}
      className={joinClasses('my-1.5 rounded-control bg-hue-line', isPast && 'opacity-40')}
    />
  )
}

type NowMarkerProps = {
  range: DayLineRange
  now: number
}

function NowMarker({ range, now }: NowMarkerProps) {
  if (now < range.startHour * 60) return null
  const column = `col-start-${place(range, now, now).colStart}`
  return (
    <>
      <span className={joinClasses('row-start-1 -translate-x-1/2 justify-self-start rounded-control bg-ink px-1.5 type-eyebrow tracking-normal tabular-nums text-canvas', column)}>
        {timeOfDayLabel(now)}
      </span>
      <span aria-hidden="true" className={joinClasses('z-10 row-start-2 w-0.5 justify-self-start bg-ink', column)} />
    </>
  )
}

function HourMarks({ range }: { range: DayLineRange }) {
  return (
    <>
      {hourMarks(range).map((hour, index) => (
        <span
          key={hour}
          className={joinClasses(
            'row-start-3 justify-self-start type-eyebrow tracking-normal tabular-nums text-ink-muted',
            `col-start-${place(range, hour * 60, hour * 60).colStart}`,
            index > 0 && '-translate-x-1/2',
          )}
        >
          {String(hour).padStart(2, '0')}
        </span>
      ))}
      <span className="col-span-full row-start-3 justify-self-end type-eyebrow tracking-normal tabular-nums text-ink-muted">24</span>
    </>
  )
}

function summary(items: DayItem[], freeLabel?: string) {
  const count = `${items.length} ${items.length === 1 ? 'compromisso' : 'compromissos'}`
  return `Linha do dia: ${count}${freeLabel ? `; ${freeLabel}` : ''}.`
}
