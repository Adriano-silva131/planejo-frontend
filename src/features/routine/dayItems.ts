import { minutesInDay, minutesOfDay } from '@/shared/time/timeOfDay'
import type { PlannedBlock, PlannedDay } from './api/routineTypes'

export type DayItem = { key: string; start: number; end: number; block: PlannedBlock }

export type FreeGap = { start: number; end: number }

export function blockKey(block: PlannedBlock) {
  return `block-${block.taskId}-${block.start}`
}

// Blocos do dia, fixos e sessões encaixadas, em ordem de início.
export function dayItems(day: PlannedDay): DayItem[] {
  return (day.blocks ?? [])
    .map((block): DayItem => ({ key: blockKey(block), ...span(block), block }))
    .sort((a, b) => a.start - b.start || a.end - b.end)
}

// Intervalos sem bloco, de from até o fim do dia.
export function freeGaps(items: DayItem[], from: number): FreeGap[] {
  const gaps: FreeGap[] = []
  let cursor = from
  for (const item of items) {
    if (item.start > cursor) gaps.push({ start: cursor, end: item.start })
    cursor = Math.max(cursor, item.end)
  }
  if (cursor < minutesInDay) gaps.push({ start: cursor, end: minutesInDay })
  return gaps
}

export function nextBreak(items: DayItem[], from: number, minMinutes = 30) {
  return freeGaps(items, from).find((gap) => gap.end - gap.start >= minMinutes)
}

export function longestGap(items: DayItem[], from: number) {
  return freeGaps(items, from).reduce<FreeGap | undefined>(
    (longest, gap) => (!longest || gap.end - gap.start > longest.end - longest.start ? gap : longest),
    undefined,
  )
}

function span(item: { start: string; end: string }) {
  return { start: minutesOfDay(item.start), end: minutesOfDay(item.end) }
}
