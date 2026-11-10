import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiPut } from '@/shared/api/apiClient'

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

function useSessionMutation<T>(request: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    // Também no erro: um 409 pode vir do que mudou em outra aba, e mudar de dia pode falhar com o encaixe já feito.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['routine'] })
    },
  })
}

export function usePlaceSession() {
  return useSessionMutation(({ start, end, ...target }: SessionTarget & SessionTimes) =>
    apiPut(sessionPath(target), end ? { start, end } : { start }),
  )
}

export function useRemoveSession() {
  return useSessionMutation((target: SessionTarget) => apiDelete(sessionPath(target)))
}

type MoveInput = SessionTimes & {
  from: SessionTarget
  date: string
}

// Mudar de dia encaixa no dia novo antes de tirar do antigo, para a sessão não sumir se a primeira chamada falhar.
export function useMoveSession() {
  return useSessionMutation(async ({ from, date, start, end }: MoveInput) => {
    await apiPut(sessionPath({ taskId: from.taskId, date }), end ? { start, end } : { start })
    if (date !== from.date) await apiDelete(sessionPath(from))
  })
}
