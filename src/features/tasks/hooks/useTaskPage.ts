import { useSearchParams } from 'react-router'
import { useTasks } from '../api/taskQueries'
import type { TaskPage } from '../api/taskTypes'

export function useTaskPage() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('pagina')) || 1)
  const tasks = useTasks(page)
  const items = tasks.data?.data ?? []
  const pageCount = pageCountOf(tasks.data)

  return {
    page,
    tasks,
    items,
    pageCount,
    // Página além da última (depois de excluir ou por link antigo): a tela volta para a última que existe.
    lastPageSearch: tasks.isSuccess && items.length === 0 && page > 1 ? (pageCount > 1 ? `?pagina=${pageCount}` : '') : undefined,
    setPage: (next: number) =>
      setParams((current) => {
        const updated = new URLSearchParams(current)
        updated.set('pagina', String(next))
        return updated
      }),
  }
}

function pageCountOf(data: TaskPage | undefined) {
  return data ? Math.ceil(data.meta.total / data.meta.perPage) : 1
}
