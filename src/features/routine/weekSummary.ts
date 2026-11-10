import { formatDuration } from '@/shared/time/timeOfDay'
import type { PlannedDay } from './api/routineTypes'
import { blockMinutes } from './blockTime'
import { dayItems, freeGaps, type FreeGap } from './dayItems'
import { planDay } from './dayPlan'
import { visibleHours, type HourRange } from './weekGrid'

export type DayFree = {
  date: string
  freeMinutes: number
  busyMinutes: number
  windowMinutes: number
  isPast: boolean
  isEmpty: boolean
}

export type AreaHours = { area: string; minutes: number }

// O dia livre conta do início ao fim da grade (7h às 22h, ou mais quando algo passa disso); hoje, a partir de agora.
export function dayFree(day: PlannedDay, range: HourRange, today: string, now: number): DayFree {
  const until = range.endHour * 60
  const from = day.date === today ? Math.min(Math.max(now, range.startHour * 60), until) : range.startHour * 60
  const blocks = day.blocks ?? []
  const { freeMinutes, busyMinutes } = planDay(blocks, from, until)
  return {
    date: day.date,
    freeMinutes,
    busyMinutes,
    windowMinutes: until - from,
    isPast: day.date < today,
    isEmpty: blocks.length === 0,
  }
}

// O livre de hoje com a mesma grade da semana, para Meu dia, Semana e o card lateral darem o mesmo número.
export function todayFree(week: PlannedDay[], today: string, now: number): DayFree | undefined {
  const day = week.find((item) => item.date === today)
  return day && dayFree(day, visibleHours(week), today, now)
}

// Na semana em andamento conta o que ainda vem; nas outras, a semana inteira.
export function weekFreeMinutes(days: DayFree[]) {
  const upcoming = days.filter((day) => !day.isPast)
  return (upcoming.length > 0 ? upcoming : days).reduce((sum, day) => sum + day.freeMinutes, 0)
}

export function plannedByArea(days: PlannedDay[]): AreaHours[] {
  const totals = new Map<string, number>()
  for (const block of days.flatMap((day) => day.blocks ?? [])) {
    totals.set(block.area, (totals.get(block.area) ?? 0) + blockMinutes(block))
  }
  return [...totals].map(([area, minutes]) => ({ area, minutes })).sort((a, b) => b.minutes - a.minutes)
}

const minFreeLabel = 4 * 60

export type FreeStretch = FreeGap & { label: string }

// O maior trecho livre visível de um dia que ainda vem, quando for longo; o nome vem do meio do trecho. Dia sem nada
// marcado é todo "Livre", do que resta da faixa visível.
export function freeStretch(day: PlannedDay, range: HourRange, from: number): FreeStretch | undefined {
  const limit = range.endHour * 60
  if ((day.blocks ?? []).length === 0) {
    const start = Math.max(from, range.startHour * 60)
    return start < limit ? { start, end: limit, label: 'Livre' } : undefined
  }
  const visible = freeGaps(dayItems(day), Math.max(from, range.startHour * 60))
    .map((gap) => ({ start: gap.start, end: Math.min(gap.end, limit) }))
    .filter((gap) => gap.end - gap.start >= minFreeLabel)
  const longest = visible.sort((a, b) => b.end - b.start - (a.end - a.start))[0]
  return longest && { ...longest, label: periodLabel((longest.start + longest.end) / 2) }
}

function periodLabel(minute: number) {
  if (minute < 12 * 60) return 'Manhã livre'
  if (minute < 18 * 60) return 'Tarde livre'
  return 'Noite livre'
}

// Cada trecho livre de pelo menos minMinutes na faixa visível de um dia que ainda vem, com quanto tempo dura; no dia
// aberto da Semana, para ver onde cabe algo.
export function freeGapLabels(day: PlannedDay, range: HourRange, from: number, minMinutes = 30): FreeStretch[] {
  const limit = range.endHour * 60
  return freeGaps(dayItems(day), Math.max(from, range.startHour * 60))
    .map((gap) => ({ start: gap.start, end: Math.min(gap.end, limit) }))
    .filter((gap) => gap.end - gap.start >= minMinutes)
    .map((gap) => ({ ...gap, label: `${formatDuration(gap.end - gap.start)} livres` }))
}
