import { minutesOfDay } from '@/shared/time/timeOfDay'
import type { RoutineBlock } from './api/routineTypes'

export function blockTimeLabel(block: RoutineBlock) {
  if (block.continuesFromPreviousDay && block.continuesNextDay) return 'o dia todo'
  if (block.continuesFromPreviousDay) return `até ${block.end}`
  if (block.continuesNextDay) return `${block.start} até amanhã`
  return `${block.start}–${block.end}`
}

export function blockMinutes(block: RoutineBlock) {
  return minutesOfDay(block.end) - minutesOfDay(block.start)
}
