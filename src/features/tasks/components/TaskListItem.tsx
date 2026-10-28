import { ChevronRight, Lock } from 'lucide-react'
import { Link } from 'react-router'
import { areaCategoryId } from '@/shared/theme/areaColors'
import type { Task } from '../api/taskTypes'
import { priorityLabels } from '../taskLabels'
import { scheduleSummary } from '../taskSummary'

export type TaskListItemProps = {
  task: Task
}

export function TaskListItem({ task }: TaskListItemProps) {
  return (
    <li>
      <Link
        to={`/atividades/${task.id}`}
        className="flex items-center gap-4 rounded-card border border-line bg-surface p-4 hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span data-category={areaCategoryId(task.area)} aria-hidden="true" className="size-3 shrink-0 rounded-full bg-hue-line" />
        <div className="min-w-0 flex-1">
          <p className="truncate type-label">{task.title}</p>
          <p className="type-meta text-ink-muted">
            {task.area} · {scheduleSummary(task)}
          </p>
        </div>
        {task.priority && (
          <span className="hidden rounded-full bg-ink/5 px-3 py-1 type-meta sm:inline">
            Prioridade {priorityLabels[task.priority].toLowerCase()}
          </span>
        )}
        {task.kind === 'fixed' && (
          <span className="text-ink-muted">
            <Lock aria-hidden="true" className="size-4" />
            <span className="sr-only">Horário fixo</span>
          </span>
        )}
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink-muted" />
      </Link>
    </li>
  )
}
