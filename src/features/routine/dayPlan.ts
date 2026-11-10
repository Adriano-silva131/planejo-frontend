import { minutesInDay, minutesOfDay } from '@/shared/time/timeOfDay'
import type { RoutineBlock } from './api/routineTypes'

export type DayPlan = {
  highlight?: { block: RoutineBlock; isNow: boolean }
  rest: RoutineBlock[]
  freeMinutes: number
  busyMinutes: number
}

// Os blocos chegam da API em ordem de início. Livre e ocupado contam de now até until, o fim do dia útil.
export function planDay(blocks: RoutineBlock[], now: number, until = minutesInDay): DayPlan {
  const remaining = blocks.filter((block) => minutesOfDay(block.end) > now)
  const current = remaining.find((block) => minutesOfDay(block.start) <= now)
  const highlight = current ?? remaining[0]
  const busy = busyMinutes(remaining, now, until)

  return {
    highlight: highlight && { block: highlight, isNow: highlight === current },
    rest: remaining.filter((block) => block !== highlight),
    freeMinutes: Math.max(until - now, 0) - busy,
    busyMinutes: busy,
  }
}

function busyMinutes(blocks: RoutineBlock[], from: number, until: number) {
  let busy = 0
  let coveredUntil = from
  for (const block of blocks) {
    const start = Math.max(minutesOfDay(block.start), coveredUntil)
    const end = Math.min(minutesOfDay(block.end), until)
    if (end > start) {
      busy += end - start
      coveredUntil = end
    }
  }
  return busy
}
