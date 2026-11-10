import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchField } from '@/shared/ui/SearchField'
import type { AreaCount } from '../taskFilters'
import { AreaFilterChips } from './AreaFilterChips'

export type TaskListHeaderProps = {
  total?: number
  areas: AreaCount[]
  area?: string
  query: string
  onAreaChange: (area?: string) => void
  onQueryChange: (query: string) => void
  onNew: () => void
}

export function TaskListHeader({ total, areas, area, query, onAreaChange, onQueryChange, onNew }: TaskListHeaderProps) {
  return (
    <PageHeader
      eyebrow={total === undefined ? undefined : total === 1 ? '1 atividade' : `${total} atividades`}
      title={
        <>
          Tudo o que <span className="text-peach-ink">entra</span> no seu plano.
        </>
      }
      actions={
        <>
          <div className="hidden md:block">
            <SearchField label="Buscar atividade" value={query} onChange={(event) => onQueryChange(event.target.value)} className="w-64" />
          </div>
          <Button aria-label="Nova atividade" onClick={onNew}>
            <Plus aria-hidden="true" className="size-5" />
            <span className="hidden md:inline">Nova atividade</span>
          </Button>
        </>
      }
    >
      {areas.length > 0 && <AreaFilterChips areas={areas} selected={area} onSelect={onAreaChange} />}
    </PageHeader>
  )
}
