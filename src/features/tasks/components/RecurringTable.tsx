import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { Task } from '../api/taskTypes'
import { periodLabels } from '../taskLabels'
import { EditTaskButton } from './EditTaskButton'
import { PriorityBars, WeekdayDots } from './TaskTableParts'

export type RecurringTableProps = {
  tasks: Task[]
  onEdit: (id: string) => void
}

// Proporções do layout: a tabela cresce sem juntar as colunas num canto. Abaixo da largura mínima, rola para o lado.
const columnClasses = {
  activity: 'w-1/4 pr-4',
  days: 'w-1/3 pr-4 whitespace-nowrap',
  duration: 'w-1/6 pr-4 whitespace-nowrap',
  period: 'w-1/8 pr-4 whitespace-nowrap',
  priority: 'w-1/8 whitespace-nowrap',
  edit: 'w-14 text-right',
}

const headClasses = 'pb-3 text-left type-eyebrow text-ink-muted font-bold'

export function RecurringTable({ tasks, onEdit }: RecurringTableProps) {
  return (
    <section aria-labelledby="recurring-title" className="flex flex-col gap-4 rounded-card bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="recurring-title" className="type-label">
          Recorrentes
        </h2>
        <p className="type-meta text-ink-muted">Encaixe cada vez na Semana, no dia que der</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-2xl table-fixed border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={joinClasses(headClasses, columnClasses.activity)}>
                Atividade
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.days)}>
                Por semana
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.duration)}>
                Duração
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.period)}>
                Período
              </th>
              <th scope="col" className={joinClasses(headClasses, columnClasses.priority)}>
                Prioridade
              </th>
              <th scope="col" className={columnClasses.edit}>
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <RecurringRow key={task.id} task={task} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type RecurringRowProps = {
  task: Task
  onEdit: (id: string) => void
}

function RecurringRow({ task, onEdit }: RecurringRowProps) {
  const period = task.period ? periodLabels[task.period] : 'qualquer'
  return (
    <tr data-category={areaCategoryId(task.area)} className="border-b border-line last:border-b-0 hover:bg-surface-alt">
      <td className={joinClasses('py-3', columnClasses.activity)}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
          <div className="min-w-0">
            <p className="truncate type-label">{task.title}</p>
            <p className="truncate type-meta text-ink-muted">{task.area}</p>
          </div>
        </div>
      </td>
      <td className={joinClasses('py-3', columnClasses.days)}>
        <div className="flex items-center gap-3">
          <span className="type-control tabular-nums">{`${task.timesPerWeek ?? 0}×`}</span>
          {(task.weekdays ?? []).length > 0 && <WeekdayDots days={task.weekdays ?? []} />}
        </div>
      </td>
      <td className={joinClasses('py-3 type-control tabular-nums', columnClasses.duration)}>{formatDuration(task.durationMinutes ?? 0)}</td>
      <td className={joinClasses('py-3 type-meta text-ink-muted first-letter:uppercase', columnClasses.period)}>{period}</td>
      <td className={joinClasses('py-3', columnClasses.priority)}>{task.priority && <PriorityBars priority={task.priority} />}</td>
      <td className={joinClasses('py-3', columnClasses.edit)}>
        <EditTaskButton task={task} onEdit={onEdit} />
      </td>
    </tr>
  )
}
