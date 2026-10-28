import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/shared/api/apiClient'
import type { RoutineWeek } from './routineTypes'

export function useWeekRoutine(day: string) {
  return useQuery({
    queryKey: ['routine', 'week', day],
    queryFn: () => apiGet<RoutineWeek>('/routine', { week: day }),
  })
}
