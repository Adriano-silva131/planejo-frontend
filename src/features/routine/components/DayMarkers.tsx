import { joinClasses } from '@/shared/ui/joinClasses'
import { hourRow, rowCount, rowPlacement, type HourRange } from '../weekGrid'

export type GridLinesProps = {
  range: HourRange
}

// Fundo da coluna: a altura da faixa visível e uma linha a cada duas horas.
export function GridLines({ range }: GridLinesProps) {
  const hours = Array.from({ length: Math.ceil((range.endHour - range.startHour) / 2) }, (_, index) => range.startHour + index * 2)
  return (
    <>
      <div aria-hidden="true" className={joinClasses('col-span-full row-start-1', `row-span-${rowCount(range)}`)} />
      {hours.map((hour) => (
        <div key={hour} aria-hidden="true" className={joinClasses('col-span-full border-t border-line', `row-start-${hourRow(hour, range)} row-span-24`)} />
      ))}
    </>
  )
}

export type FreeStretchLabelProps = {
  start: number
  end: number
  label: string
  range: HourRange
}

export function FreeStretchLabel({ start, end, label, range }: FreeStretchLabelProps) {
  const { rowStart, rowSpan } = rowPlacement(start, end, range)
  return (
    <p className={joinClasses('col-span-full flex items-center justify-center px-1 text-center type-section text-ink-muted', `row-start-${rowStart} row-span-${rowSpan}`)}>
      {label}
    </p>
  )
}

export type NowLineProps = {
  now: number
  range: HourRange
}

export function NowLine({ now, range }: NowLineProps) {
  const { rowStart } = rowPlacement(now, now + 5, range)
  return (
    <div aria-hidden="true" className={joinClasses('z-50 col-span-full flex items-center self-start', `row-start-${rowStart}`)}>
      <span className="-ml-1 size-2 shrink-0 rounded-full bg-ink" />
      <span className="h-0.5 flex-1 bg-ink" />
    </div>
  )
}
