import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { RoutineBlock, PlannedDay } from '@/features/routine/api/routineTypes'
import type { Task } from '@/features/tasks/api/taskTypes'
import { minutesOfDay } from '@/shared/time/timeOfDay'

export type WeekTimeInput = {
  days: PlannedDay[]
  progress: WeekProgress
  tasks: Task[]
  today: string
  now: number
}

export type DayTime = { date: string; done: number; planned: number }
export type AreaTime = { area: string; minutes: number }

// Planejado: os blocos do dia, fixos e sessões encaixadas, mais as recorrentes feitas sem sessão. Feito: blocos
// fixos que já passaram (fixa sempre acontece) e recorrentes registradas vezes a duração. Sessão de pontual entra
// só no planejado: o registro da pontual é a conclusão, não o tempo gasto.
export function dayTimes({ days, progress, tasks, today, now }: WeekTimeInput): DayTime[] {
  const byId = new Map(tasks.map((task) => [task.id, task]))
  return days.map((day) => {
    const blocks = day.blocks ?? []
    const doneToday = (progress.recurring ?? []).filter((item) => (item.days ?? []).includes(day.date))
    const minutesOf = (taskId: string) => byId.get(taskId)?.durationMinutes ?? 0
    const unplannedDone = doneToday
      .filter((item) => !blocks.some((block) => block.taskId === item.taskId))
      .reduce((sum, item) => sum + minutesOf(item.taskId), 0)
    return {
      date: day.date,
      done: fixedBlocks(blocks).reduce((sum, block) => sum + elapsed(block, day.date, today, now), 0) +
        doneToday.reduce((sum, item) => sum + minutesOf(item.taskId), 0),
      planned: blocks.reduce((sum, block) => sum + length(block), 0) + unplannedDone,
    }
  })
}

function fixedBlocks(blocks: RoutineBlock[]) {
  return blocks.filter((block) => block.taskKind === 'fixed')
}

// Áreas com algo na semana, mesmo sem nada feito ainda; da que tomou mais tempo para a que tomou menos.
export function areaTimes(input: WeekTimeInput): AreaTime[] {
  const totals = new Map<string, number>()
  for (const [area, minutes] of [...fixedDone(input), ...recurringDone(input)]) {
    if (area !== undefined) totals.set(area, (totals.get(area) ?? 0) + minutes)
  }
  return [...totals].map(([area, minutes]) => ({ area, minutes })).sort((a, b) => b.minutes - a.minutes)
}

type AreaMinutes = [area: string | undefined, minutes: number]

function fixedDone({ days, today, now }: WeekTimeInput): AreaMinutes[] {
  return days.flatMap((day) =>
    fixedBlocks(day.blocks ?? []).map((block): AreaMinutes => [block.area, elapsed(block, day.date, today, now)]),
  )
}

function recurringDone({ progress, tasks }: WeekTimeInput): AreaMinutes[] {
  const byId = new Map(tasks.map((task) => [task.id, task]))
  return (progress.recurring ?? []).map((item) => {
    const task = byId.get(item.taskId)
    return [task?.area, item.done * (task?.durationMinutes ?? 0)]
  })
}

function length(block: RoutineBlock) {
  return minutesOfDay(block.end) - minutesOfDay(block.start)
}

function elapsed(block: RoutineBlock, date: string, today: string, now: number) {
  if (date < today) return length(block)
  if (date > today) return 0
  return Math.min(Math.max(now - minutesOfDay(block.start), 0), length(block))
}
