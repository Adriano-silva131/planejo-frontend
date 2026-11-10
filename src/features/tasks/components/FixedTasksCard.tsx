import { Lock } from 'lucide-react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import type { Task } from '../api/taskTypes'
import { weekdaysLabel } from '../taskSummary'
import { EditTaskButton } from './EditTaskButton'

export type FixedTasksCardProps = {
  tasks: Task[]
  onEdit: (id: string) => void
}

export function FixedTasksCard({ tasks, onEdit }: FixedTasksCardProps) {
  return (
    <section aria-labelledby="fixed-title" className="flex flex-col gap-2 rounded-card bg-surface p-5">
      <h2 id="fixed-title" className="flex items-center gap-2 type-label">
        <Lock aria-hidden="true" className="size-4" />
        Horário fixo
      </h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} data-category={areaCategoryId(task.area)} className="border-t border-line first:border-t-0">
            <div className="flex items-center gap-4 py-3">
              <span className="flex w-14 shrink-0 flex-col tabular-nums">
                <span className="type-label">{task.start}</span>
                <span className="type-meta text-ink-muted">{task.end}</span>
              </span>
              <span aria-hidden="true" className="w-1 self-stretch rounded-full bg-hue-line" />
              <span className="min-w-0 flex-1">
                <span className="block truncate type-label">{task.title}</span>
                <span className="block truncate type-meta text-ink-muted">{weekdaysLabel(task.weekdays ?? [])}</span>
              </span>
              <EditTaskButton task={task} onEdit={onEdit} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
