import { Plus } from 'lucide-react'
import { Navigate, useSearchParams } from 'react-router'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useTasks } from '../api/taskQueries'
import type { TaskPage } from '../api/taskTypes'
import { EmptyTasks } from '../components/EmptyTasks'
import { ListSkeleton } from '../components/ListSkeleton'
import { TaskList } from '../components/TaskList'
import { TaskPagination } from '../components/TaskPagination'

export function TaskListPage() {
  const [params, setParams] = useSearchParams()
  const page = pageParam(params)
  const tasks = useTasks(page)
  const items = tasks.data?.data ?? []
  const pageCount = pageCountOf(tasks.data)

  if (tasks.isSuccess && items.length === 0 && page > 1) {
    return <Navigate to={{ search: lastPageSearch(pageCount) }} replace />
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Atividades · Planejo</title>
      <PageHeader
        title="Atividades"
        description="Tudo o que entra no seu plano."
        actions={
          <ButtonLink to="/atividades/nova" aria-label="Nova atividade">
            <Plus aria-hidden="true" className="size-5" />
            <span className="hidden md:inline">Nova atividade</span>
          </ButtonLink>
        }
      />
      {tasks.isPending && <ListSkeleton />}
      {tasks.isError && (
        <ErrorState title="Não deu para carregar as atividades." error={tasks.error} onRetry={() => void tasks.refetch()} />
      )}
      {tasks.isSuccess && (items.length === 0 ? <EmptyTasks /> : <TaskList tasks={items} />)}
      <TaskPagination page={page} pageCount={pageCount} onChange={(next) => setParams({ pagina: String(next) })} />
    </div>
  )
}

function pageParam(params: URLSearchParams) {
  return Math.max(1, Number(params.get('pagina')) || 1)
}

function pageCountOf(data: TaskPage | undefined) {
  return data ? Math.ceil(data.meta.total / data.meta.perPage) : 1
}

// Página além da última (depois de excluir ou por link antigo): volta para a última que existe.
function lastPageSearch(pageCount: number) {
  return pageCount > 1 ? `?pagina=${pageCount}` : ''
}
