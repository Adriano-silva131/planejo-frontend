import type { Task, TaskFields } from './api/taskTypes'
import { emptyTaskForm, totalMinutes, type TaskFormValues } from './taskSchema'

export function toTaskPayload(values: TaskFormValues): TaskFields {
  const base = { title: values.title.trim(), area: values.area.trim(), kind: values.kind }
  const period = values.period ? { period: values.period } : {}
  const priority = values.priority || undefined

  if (values.kind === 'fixed') {
    const days = values.fixedRepeat === 'date' ? { date: values.date } : { weekdays: values.weekdays }
    return { ...base, ...days, start: values.start, end: values.end }
  }
  if (values.kind === 'recurring') {
    return { ...base, priority, weekdays: values.weekdays, durationMinutes: totalMinutes(values), ...period }
  }
  return { ...base, priority, durationMinutes: totalMinutes(values), deadline: values.deadline, ...period }
}

const optionalFields = ['date', 'start', 'end', 'priority', 'deadline', 'period'] as const

export function fromTask(task: Task): TaskFormValues {
  const optional = Object.fromEntries(optionalFields.map((name) => [name, task[name] ?? '']))
  return {
    ...emptyTaskForm,
    ...(optional as Pick<TaskFormValues, (typeof optionalFields)[number]>),
    title: task.title,
    area: task.area,
    kind: task.kind,
    fixedRepeat: task.date ? 'date' : 'weekdays',
    weekdays: task.weekdays ?? [],
    ...durationFields(task.durationMinutes),
  }
}

function durationFields(minutes = 0) {
  if (minutes === 0) return { durationHours: '', durationMinutes: '' }
  return { durationHours: String(Math.floor(minutes / 60)), durationMinutes: String(minutes % 60) }
}
