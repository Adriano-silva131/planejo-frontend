import { apiDelete, apiPut } from '@/shared/api/apiClient'
import { useRoutineMutation } from './useRoutineMutation'

// A ocorrência de um fixo que começa em date. Ajustar muda só ela; a tarefa continua com o horário de sempre.
export type OccurrenceTarget = {
  taskId: string
  date: string
}

// "00:00" no fim é meia-noite; fim antes do início termina no dia seguinte.
export type OccurrenceTimes = {
  start: string
  end: string
}

const occurrencePath = ({ taskId, date }: OccurrenceTarget) => `/tasks/${taskId}/occurrences/${date}`

export function useMoveOccurrence() {
  return useRoutineMutation(({ start, end, ...target }: OccurrenceTarget & OccurrenceTimes) =>
    apiPut(occurrencePath(target), { start, end }),
  )
}

export function useSkipOccurrence() {
  return useRoutineMutation((target: OccurrenceTarget) => apiPut(occurrencePath(target), { skipped: true }))
}

// Volta ao horário da tarefa, desfazendo a mudança ou a falta neste dia.
export function useResetOccurrence() {
  return useRoutineMutation((target: OccurrenceTarget) => apiDelete(occurrencePath(target)))
}
