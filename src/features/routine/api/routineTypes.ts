import type { components } from '@/shared/api/schema'

export type RoutineWeek = components['schemas']['RoutineWeekBody']
export type RoutineDay = components['schemas']['DayBody']
export type RoutineBlock = components['schemas']['BlockBody']

export type DayPeriod = 'morning' | 'afternoon' | 'evening'

// Recorrente ou pontual do dia sem horário: prevista pelos dias de costume (usual), encaixada só por período
// (session) ou feita num dia sem sessão (checkin). Formato combinado com o backend para a Semana em quadro; sai
// daqui quando os tipos forem regerados com plans.
export type DayPlanItem = {
  taskId: string
  title: string
  area: string
  taskKind: 'recurring' | 'one_off'
  source: 'usual' | 'session' | 'checkin'
  period?: DayPeriod
  minutes?: number
  done: boolean
}

// done: a sessão teve registro de feito no dia; ausente enquanto a API não manda.
export type PlannedBlock = RoutineBlock & { done?: boolean }

export type PlannedDay = Omit<RoutineDay, 'blocks'> & {
  blocks: PlannedBlock[] | null
  plans?: DayPlanItem[] | null
}
