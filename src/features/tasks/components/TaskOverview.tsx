import { Button } from '@/shared/ui/Button'
import type { Task } from '../api/taskTypes'
import { filterTasks, fixedByStart, oneOffByDate, type TaskFilter } from '../taskFilters'
import { FixedTasksCard } from './FixedTasksCard'
import { OneOffTasksCard, type OneOffStatus } from './OneOffTasksCard'
import { RecurringTable } from './RecurringTable'

export type TaskOverviewProps = {
  tasks: Task[]
  filter: TaskFilter
  today: string
  oneOffStatus?: OneOffStatus
  onClearFilter: () => void
  onEdit: (id: string) => void
}

export function TaskOverview({ tasks, filter, today, oneOffStatus, onClearFilter, onEdit }: TaskOverviewProps) {
  const visible = filterTasks(tasks, filter)
  const recurring = visible.filter((task) => task.kind === 'recurring')
  const fixed = fixedByStart(visible)
  const oneOff = oneOffByDate(visible, today)

  if (visible.length === 0) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-card bg-surface p-5">
        <h2 className="type-section">Nenhuma atividade encontrada.</h2>
        <p className="text-ink-muted">Tente outra busca ou outra área.</p>
        <Button variant="secondary" onClick={onClearFilter}>
          Limpar filtros
        </Button>
      </section>
    )
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-3 xl:gap-8">
      {recurring.length > 0 && (
        <div className="xl:col-span-2">
          <RecurringTable tasks={recurring} onEdit={onEdit} />
        </div>
      )}
      <div className="flex flex-col gap-6">
        {fixed.length > 0 && <FixedTasksCard tasks={fixed} onEdit={onEdit} />}
        {oneOff.length > 0 && <OneOffTasksCard tasks={oneOff} today={today} status={oneOffStatus} onEdit={onEdit} />}
      </div>
    </div>
  )
}
