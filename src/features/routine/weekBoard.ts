import { minutesOfDay } from '@/shared/time/timeOfDay'
import type { DayPeriod, DayPlanItem, PlannedBlock, PlannedDay } from './api/routineTypes'
import { planDay } from './dayPlan'

export type BoardPeriod = {
  id: DayPeriod
  label: string
  // Fixos e sessões com horário que começam no período, em ordem de início.
  fixed: PlannedBlock[]
  sessions: PlannedBlock[]
  // O que vem da API sem horário para este período.
  plans: DayPlanItem[]
  // Livre no período, fora o que tem horário; hoje, a partir de agora. Ausente num dia que passou.
  freeMinutes?: number
  // Quanto o que vem sem horário e ainda não foi feito pede do livre.
  plannedMinutes: number
}

export type BoardDay = {
  date: string
  isPast: boolean
  isToday: boolean
  // Sem período: aparece no topo do dia.
  loose: DayPlanItem[]
  periods: BoardPeriod[]
}

// Faixas iguais às da grade (7h às 22h). O que começa antes das 7h fica na manhã; depois das 22h, na noite.
export const dayPeriods: { id: DayPeriod; label: string; from: number; to: number }[] = [
  { id: 'morning', label: 'Manhã', from: 7 * 60, to: 12 * 60 },
  { id: 'afternoon', label: 'Tarde', from: 12 * 60, to: 18 * 60 },
  { id: 'evening', label: 'Noite', from: 18 * 60, to: 22 * 60 },
]

export function periodAt(minute: number): DayPeriod {
  if (minute < 12 * 60) return 'morning'
  return minute < 18 * 60 ? 'afternoon' : 'evening'
}

// O dia no quadro da Semana: fixos, sessões e o que vem sem horário, por período. Num dia que passou, só o que foi
// feito (e os fixos, que aconteceram); o que não rolou fica com o Para encaixar.
export function boardDay(day: PlannedDay, today: string, now: number): BoardDay {
  const isPast = day.date < today
  const isToday = day.date === today
  const blocks = day.blocks ?? []
  const shown = (done: boolean | undefined) => !isPast || done !== false
  const plans = (day.plans ?? []).filter((plan) => shown(plan.done))

  const periods = dayPeriods.map(({ id, label, from, to }): BoardPeriod => {
    const starts = (block: PlannedBlock) => periodAt(minutesOfDay(block.start)) === id
    const periodPlans = plans.filter((plan) => plan.period === id)
    return {
      id,
      label,
      fixed: blocks.filter((block) => block.taskKind === 'fixed' && starts(block)),
      sessions: blocks.filter((block) => block.taskKind !== 'fixed' && starts(block) && shown(block.done)),
      plans: periodPlans,
      freeMinutes: isPast ? undefined : periodFree(blocks, from, to, isToday ? now : undefined),
      plannedMinutes: periodPlans.filter((plan) => !plan.done).reduce((sum, plan) => sum + (plan.minutes ?? 0), 0),
    }
  })

  return { date: day.date, isPast, isToday, loose: plans.filter((plan) => !plan.period), periods }
}

// Período sem nada e sem tempo livre (já passou, ou ocupado pelo trabalho) não aparece.
export function showsPeriod(period: BoardPeriod) {
  const hasItems = period.fixed.length + period.sessions.length + period.plans.length > 0
  return hasItems || (period.freeMinutes ?? 0) > 0
}

// Quanto do livre ainda sobra no dia, fora o que vem sem horário. Ausente num dia que passou.
export function dayRoom(board: BoardDay) {
  if (board.isPast) return undefined
  return board.periods.reduce((sum, period) => sum + Math.max((period.freeMinutes ?? 0) - period.plannedMinutes, 0), 0)
}

export type DayGlance = { key: string; title: string; area: string; fixed: boolean; done: boolean }

// O que o dia tem, na ordem do quadro: a coluna encolhida ao lado do dia aberto mostra só isso.
export function dayGlance(board: BoardDay): DayGlance[] {
  const plan = (item: DayPlanItem): DayGlance => ({
    key: `plan-${item.taskId}-${item.source}`,
    title: item.title,
    area: item.area,
    fixed: false,
    done: item.done,
  })
  const block = (item: PlannedBlock): DayGlance => ({
    key: `block-${item.taskId}-${item.start}`,
    title: item.title,
    area: item.area,
    fixed: item.taskKind === 'fixed',
    done: !!item.done,
  })
  return [
    ...board.loose.map(plan),
    ...board.periods.flatMap((period) => [...period.fixed.map(block), ...period.sessions.map(block), ...period.plans.map(plan)]),
  ]
}

// "9h", "18:45": o horário curto das linhas do quadro.
export function shortTimeLabel(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}:${String(rest).padStart(2, '0')}`
}

export function shortRangeLabel(block: { start: string; end: string }) {
  return `${shortTimeLabel(minutesOfDay(block.start))}–${shortTimeLabel(minutesOfDay(block.end))}`
}

function periodFree(blocks: PlannedBlock[], from: number, to: number, now?: number) {
  const start = now === undefined ? from : Math.min(Math.max(now, from), to)
  return planDay(blocks, start, to).freeMinutes
}
