import { useMemo } from 'react'
import { useWeekProgress } from '@/features/progress/api/progressQueries'
import { TaskListPage } from '@/features/tasks/pages/TaskListPage'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'

// As pontuais mostram se já foram concluídas, o que vem do progresso da semana atual.
export function TasksRoute() {
  const progress = useWeekProgress(toIsoDate(useNow()))
  const oneOffStatus = useMemo(
    () => (progress.data ? new Map((progress.data.oneOff ?? []).map((item) => [item.taskId, { completedOn: item.completedOn }])) : undefined),
    [progress.data],
  )
  return <TaskListPage oneOffStatus={oneOffStatus} />
}
