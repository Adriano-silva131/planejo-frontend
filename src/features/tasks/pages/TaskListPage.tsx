import { Navigate } from 'react-router'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { ErrorState } from '@/shared/ui/ErrorState'
import { EmptyTasks } from '../components/EmptyTasks'
import { ListSkeleton } from '../components/ListSkeleton'
import type { OneOffStatus } from '../components/OneOffTasksCard'
import { TaskOverview } from '../components/TaskOverview'
import { TaskListHeader } from '../components/TaskListHeader'
import { TaskPagination } from '../components/TaskPagination'
import { TaskSheet } from '../components/TaskSheet'
import { useTaskEditor } from '../hooks/useTaskEditor'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { useTaskPage } from '../hooks/useTaskPage'
import { areaCounts } from '../taskFilters'

export type TaskListPageProps = {
  oneOffStatus?: OneOffStatus
}

export function TaskListPage({ oneOffStatus }: TaskListPageProps) {
  const { page, tasks, items, pageCount, lastPageSearch, setPage } = useTaskPage()
  const filters = useTaskFilters()
  const editor = useTaskEditor()
  const today = toIsoDate(useNow())

  if (lastPageSearch !== undefined) return <Navigate to={{ search: lastPageSearch }} replace />

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Atividades · Planejo</title>
      <TaskListHeader
        total={tasks.data?.meta.total}
        areas={areaCounts(items)}
        area={filters.area}
        query={filters.query}
        onAreaChange={filters.setArea}
        onQueryChange={filters.setQuery}
        onNew={editor.openNew}
      />
      {tasks.isPending && <ListSkeleton />}
      {tasks.isError && (
        <ErrorState title="Não deu para carregar as atividades." error={tasks.error} onRetry={() => void tasks.refetch()} />
      )}
      {tasks.isSuccess &&
        (items.length === 0 ? (
          <EmptyTasks onNew={editor.openNew} />
        ) : (
          <TaskOverview
            tasks={items}
            filter={filters}
            today={today}
            oneOffStatus={oneOffStatus}
            onClearFilter={filters.clear}
            onEdit={editor.open}
          />
        ))}
      <TaskPagination page={page} pageCount={pageCount} onChange={setPage} />
      {editor.editing && <TaskSheet editing={editor.editing} onClose={editor.close} />}
    </div>
  )
}

