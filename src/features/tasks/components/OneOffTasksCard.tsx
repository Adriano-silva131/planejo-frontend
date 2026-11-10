import { Check } from 'lucide-react'
import { daysBetween, fromIsoDate, toIsoDate } from '@/shared/time/calendarDate'
import { daysLeftLabel, deadlineLabel } from '@/shared/time/dateLabels'
import { shortDateLabel } from '@/shared/time/week'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { Task } from '../api/taskTypes'
import { isAppointment } from '../taskFilters'
import { EditTaskButton } from './EditTaskButton'

// Pontuais da semana atual, pelo id: abertas ou concluídas nela. Uma pontual fora do mapa foi concluída antes.
export type OneOffStatus = ReadonlyMap<string, { completedOn?: string }>

export type OneOffTasksCardProps = {
  tasks: Task[]
  today: string
  status?: OneOffStatus
  onEdit: (id: string) => void
}

const urgentDays = 3

export function OneOffTasksCard({ tasks, today, status, onEdit }: OneOffTasksCardProps) {
  return (
    <section aria-labelledby="one-off-title" className="flex flex-col gap-2 rounded-card bg-surface p-5">
      <h2 id="one-off-title" className="type-label">
        Pontuais
      </h2>
      <ul>
        {tasks.map((task) => (
          <OneOffRow key={task.id} task={task} today={today} status={status} onEdit={onEdit} />
        ))}
      </ul>
    </section>
  )
}

type OneOffRowProps = {
  task: Task
  today: string
  status?: OneOffStatus
  onEdit: (id: string) => void
}

function OneOffRow({ task, today, status, onEdit }: OneOffRowProps) {
  const { date, done, text } = rowState(task, today, status)

  return (
    <li className="border-t border-line first:border-t-0">
      <div className="flex flex-col gap-1 py-3">
        <span className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate type-label">{task.title}</span>
          {done ? <DoneBadge /> : <DeadlineBadge deadline={date} today={today} />}
          <EditTaskButton task={task} onEdit={onEdit} />
        </span>
        <span className="type-meta text-ink-muted first-letter:uppercase">{text}</span>
      </div>
    </li>
  )
}

// Compromisso (fixa num dia só) mostra dia e horário; pontual com prazo mostra o prazo ou a conclusão.
function rowState(task: Task, today: string, status?: OneOffStatus) {
  if (isAppointment(task)) {
    const date = fromIsoDate(task.date ?? today)
    return { date, done: false, text: `${deadlineLabel(date)}, das ${task.start} às ${task.end}` }
  }
  const date = fromIsoDate(task.deadline ?? today)
  const current = status?.get(task.id)
  if (status === undefined || (current && !current.completedOn)) return { date, done: false, text: `Até ${deadlineLabel(date)}` }
  const text = current?.completedOn ? `Concluída em ${shortDateLabel(fromIsoDate(current.completedOn))}` : 'Concluída'
  return { date, done: true, text }
}

function DoneBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 type-meta font-bold text-action">
      <Check aria-hidden="true" className="size-4" />
      Concluída
    </span>
  )
}

type DeadlineBadgeProps = {
  deadline: Date
  today: string
}

function DeadlineBadge({ deadline, today }: DeadlineBadgeProps) {
  const days = daysBetween(today, toIsoDate(deadline))
  const urgent = days <= urgentDays
  return (
    <span
      className={joinClasses(
        'shrink-0 type-meta whitespace-nowrap',
        urgent ? 'rounded-control bg-peach px-2 py-0.5 font-bold text-on-peach' : 'text-ink-muted',
      )}
    >
      {daysLeftLabel(days)}
    </span>
  )
}
