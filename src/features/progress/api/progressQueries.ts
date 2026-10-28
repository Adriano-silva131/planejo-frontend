import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiGet, apiPut } from '@/shared/api/apiClient'
import type { CheckInFields, HabitsOutput, WeekProgress } from './progressTypes'

export const habitWeeks = 8

type CheckInInput = {
  taskId: string
  date: string
  fields?: CheckInFields
}

export function useWeekProgress(week: string) {
  return useQuery({
    queryKey: ['progress', 'week', week],
    queryFn: () => apiGet<WeekProgress>('/progress', { week }),
  })
}

export function useHabits(week: string) {
  return useQuery({
    queryKey: ['progress', 'habits', week],
    queryFn: () => apiGet<HabitsOutput>('/progress/habits', { week, weeks: habitWeeks }),
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, date, fields }: CheckInInput) => apiPut(`/tasks/${taskId}/checkins/${date}`, fields),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['progress'] }),
  })
}

export function useUndoCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, date }: CheckInInput) => apiDelete(`/tasks/${taskId}/checkins/${date}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['progress'] }),
  })
}
