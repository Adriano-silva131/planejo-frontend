import type { Task, TaskFields } from './api/taskTypes'
import { emptyTaskForm, totalMinutes, type TaskFormValues } from './taskSchema'

export function toTaskPayload(values: TaskFormValues): TaskFields {
  const base = { title: values.title.trim(), area: values.area.trim(), kind: values.kind }
  const period = values.period ? { period: values.period } : {}
  const priority = values.priority || undefined

  if (values.kind === 'fixed') {
    return { ...base, weekdays: values.weekdays, start: values.start, end: values.end }
  }
  if (values.oneOffMode === 'appointment') {
    return { ...base, kind: 'fixed', date: values.date, start: values.start, end: values.end }
  }
  if (values.kind === 'recurring') {
    const usualDays = values.weekdays.length > 0 ? { weekdays: values.weekdays } : {}
    const timesPerWeek = Number(values.timesPerWeek)
    return { ...base, priority, timesPerWeek, ...usualDays, durationMinutes: totalMinutes(values), ...period }
  }
  return { ...base, priority, deadline: values.deadline, ...period }
}

const optionalFields = ['date', 'start', 'end', 'priority', 'deadline', 'period'] as const

export function fromTask(task: Task): TaskFormValues {
  const optional = Object.fromEntries(optionalFields.map((name) => [name, task[name] ?? '']))
  return {
    ...emptyTaskForm,
    ...(optional as Pick<TaskFormValues, (typeof optionalFields)[number]>),
    title: task.title,
    area: task.area,
    ...(task.date ? { kind: 'one_off', oneOffMode: 'appointment' } : { kind: task.kind }),
    weekdays: task.weekdays ?? [],
    timesPerWeek: task.timesPerWeek ? String(task.timesPerWeek) : '',
    ...durationFields(task.durationMinutes),
  }
}

function durationFields(minutes = 0) {
  if (minutes === 0) return { durationHours: '', durationMinutes: '' }
  return { durationHours: String(Math.floor(minutes / 60)), durationMinutes: String(minutes % 60) }
}
