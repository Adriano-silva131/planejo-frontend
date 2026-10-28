import type { Task, TaskKind } from '../api/taskTypes'
import { kindLabels } from '../taskLabels'
import { TaskListItem } from './TaskListItem'

const kindOrder: TaskKind[] = ['fixed', 'recurring', 'one_off']

const sectionTitles: Record<TaskKind, string> = {
  fixed: 'Com horário fixo',
  recurring: 'Recorrentes',
  one_off: 'Pontuais',
}

export type TaskListProps = {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="flex flex-col gap-8">
      {kindOrder.map((kind) => {
        const group = tasks.filter((task) => task.kind === kind)
        if (group.length === 0) return null
        return (
          <section key={kind} aria-label={kindLabels[kind]} className="flex flex-col gap-3">
            <h2 className="type-section">
              {sectionTitles[kind]} <span className="type-meta text-ink-muted">({group.length})</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {group.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
