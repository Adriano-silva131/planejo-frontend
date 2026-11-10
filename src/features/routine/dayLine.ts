import { minutesInDay } from '@/shared/time/timeOfDay'
import type { DayItem } from './dayItems'

export const dayLineSlot = 5
const defaultStartHour = 7

export type DayLineRange = { startHour: number; columns: number }
export type Placement = { colStart: number; colSpan: number }

// A linha vai até a meia-noite e começa às 7h, ou antes se algo começar mais cedo.
export function dayLineRange(items: DayItem[]): DayLineRange {
  const earliest = Math.min(defaultStartHour * 60, ...items.map((item) => item.start))
  const startHour = Math.floor(earliest / 60)
  return { startHour, columns: ((24 - startHour) * 60) / dayLineSlot }
}

export function place(range: DayLineRange, start: number, end: number): Placement {
  const offset = range.startHour * 60
  const from = Math.max(start, offset)
  const to = Math.min(end, minutesInDay)
  const colStart = Math.floor((from - offset) / dayLineSlot) + 1
  const colSpan = Math.max(1, Math.ceil((to - from) / dayLineSlot))
  return { colStart, colSpan: Math.min(colSpan, range.columns - colStart + 1) }
}

// Marcas a cada duas horas a partir do início; a meia-noite fecha a linha.
export function hourMarks(range: DayLineRange) {
  const marks: number[] = []
  for (let hour = range.startHour; hour <= 22; hour += 2) marks.push(hour)
  return marks
}
