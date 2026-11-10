import type { components } from '@/shared/api/schema'

export type RoutineWeek = components['schemas']['RoutineWeekBody']
export type RoutineDay = components['schemas']['DayBody']
export type RoutineBlock = components['schemas']['BlockBody']

export type PlannedBlock = RoutineBlock

export type PlannedDay = Omit<RoutineDay, 'blocks'> & {
  blocks: PlannedBlock[] | null
}
