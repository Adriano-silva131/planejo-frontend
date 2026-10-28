import { Button } from '@/shared/ui/Button'

export type TaskPaginationProps = {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

export function TaskPagination({ page, pageCount, onChange }: TaskPaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Páginas" className="flex items-center justify-between gap-3">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </Button>
      <span className="type-meta text-ink-muted">
        Página {page} de {pageCount}
      </span>
      <Button variant="secondary" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Próxima
      </Button>
    </nav>
  )
}
