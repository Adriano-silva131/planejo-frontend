import { minutesInDay, minutesOfDay } from '@/shared/time/timeOfDay'
import type { RoutineBlock } from './api/routineTypes'

export type DayPlan = {
  highlight?: { block: RoutineBlock; isNow: boolean }
  rest: RoutineBlock[]
  freeMinutes: number
}

// Os blocos chegam da API em ordem de início.
export function planDay(blocks: RoutineBlock[], now: number): DayPlan {
  const remaining = blocks.filter((block) => minutesOfDay(block.end) > now)
  const current = remaining.find((block) => minutesOfDay(block.start) <= now)
  const highlight = current ?? remaining[0]

  return {
    highlight: highlight && { block: highlight, isNow: highlight === current },
    rest: remaining.filter((block) => block !== highlight),
    freeMinutes: minutesInDay - now - busyMinutes(remaining, now),
  }
}

function busyMinutes(blocks: RoutineBlock[], from: number) {
  let busy = 0
  let coveredUntil = from
  for (const block of blocks) {
    const start = Math.max(minutesOfDay(block.start), coveredUntil)
    const end = minutesOfDay(block.end)
    if (end > start) {
      busy += end - start
      coveredUntil = end
    }
  }
  return busy
}
