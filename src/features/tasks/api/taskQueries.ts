import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { apiDelete, apiGet, apiPost, apiPut } from '@/shared/api/apiClient'
import type { components } from '@/shared/api/schema'
import type { Task, TaskFields, TaskPage } from './taskTypes'

export const tasksPerPage = 100

const taskKeys = {
  all: ['tasks'] as const,
  page: (page: number) => ['tasks', 'page', page] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  areas: ['tasks', 'areas'] as const,
}

// Mudar uma tarefa muda a rotina e o progresso montados a partir dela. A tarefa aberta no editor não é
// recarregada aqui: a tela navega para a lista logo em seguida.
function invalidatePlanning(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: taskKeys.all, predicate: (query) => query.queryKey[1] !== 'detail' })
  void queryClient.invalidateQueries({ queryKey: ['routine'] })
  void queryClient.invalidateQueries({ queryKey: ['progress'] })
}

export function useTasks(page: number) {
  return useQuery({
    queryKey: taskKeys.page(page),
    queryFn: () => apiGet<TaskPage>('/tasks', { page, perPage: tasksPerPage }),
  })
}

export function useTask(id: string) {
  return useQuery({ queryKey: taskKeys.detail(id), queryFn: () => apiGet<Task>(`/tasks/${id}`) })
}

export function useTaskAreas() {
  return useQuery({
    queryKey: taskKeys.areas,
    queryFn: () => apiGet<components['schemas']['AreasOutputBody']>('/tasks/areas'),
    select: (body) => (body.data ?? []).map((item) => item.area),
  })
}

export function useSaveTask(id?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fields: TaskFields) => (id ? apiPut<Task>(`/tasks/${id}`, fields) : apiPost<Task>('/tasks', fields)),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task)
      invalidatePlanning(queryClient)
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tasks/${id}`),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
      invalidatePlanning(queryClient)
    },
  })
}
