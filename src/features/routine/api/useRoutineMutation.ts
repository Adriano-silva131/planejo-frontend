import { useMutation, useQueryClient } from '@tanstack/react-query'

// Mudança na rotina da semana: sessão encaixada ou ocorrência de fixo. Recarrega a rotina também no erro, porque um
// 409 pode vir do que mudou em outra aba, e mudar uma sessão de dia pode falhar com o encaixe já feito.
export function useRoutineMutation<T>(request: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['routine'] })
    },
  })
}
