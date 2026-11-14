import { apiDelete, apiPut } from '@/shared/api/apiClient'
import { useRoutineMutation } from './useRoutineMutation'

export type SessionTarget = {
  taskId: string
  date: string
}

// Sem end, a sessão de recorrente dura o tempo da atividade; pontual precisa de end. "00:00" no fim é meia-noite.
export type SessionTimes = {
  start: string
  end?: string
}

const sessionPath = ({ taskId, date }: SessionTarget) => `/tasks/${taskId}/sessions/${date}`

export function usePlaceSession() {
  return useRoutineMutation(({ start, end, ...target }: SessionTarget & SessionTimes) =>
    apiPut(sessionPath(target), end ? { start, end } : { start }),
  )
}

export function useRemoveSession() {
  return useRoutineMutation((target: SessionTarget) => apiDelete(sessionPath(target)))
}

type MoveInput = SessionTimes & {
  from: SessionTarget
  date: string
}

// Mudar de dia encaixa no dia novo antes de tirar do antigo, para a sessão não sumir se a primeira chamada falhar.
export function useMoveSession() {
  return useRoutineMutation(async ({ from, date, start, end }: MoveInput) => {
    await apiPut(sessionPath({ taskId: from.taskId, date }), end ? { start, end } : { start })
    if (date !== from.date) await apiDelete(sessionPath(from))
  })
}
