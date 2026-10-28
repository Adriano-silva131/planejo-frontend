import { fromIsoDate } from '@/shared/time/calendarDate'
import { formatDuration } from '@/shared/time/timeOfDay'
import { shortDateLabel } from '@/shared/time/week'
import type { TaskFields, Weekday } from './api/taskTypes'
import { periodLabels, weekdayOrder, weekdayShort } from './taskLabels'

const workdays: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export function weekdaysLabel(days: readonly Weekday[]) {
  const sorted = weekdayOrder.filter((day) => days.includes(day))
  if (sorted.length === 7) return 'Todos os dias'
  if (sorted.length === 5 && workdays.every((day) => sorted.includes(day))) return 'Dias úteis'
  if (sorted.length === 2 && sorted[0] === 'saturday' && sorted[1] === 'sunday') return 'Fins de semana'
  const names = sorted.map((day) => weekdayShort[day])
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names.at(-1)}` : (names[0] ?? '')
}

export function scheduleSummary(task: TaskFields) {
  const duration = formatDuration(task.durationMinutes ?? 0)
  const period = task.period ? ` · ${periodLabels[task.period]}` : ''

  if (task.kind === 'fixed') {
    const days = task.date ? `Em ${shortDateLabel(fromIsoDate(task.date))}` : weekdaysLabel(task.weekdays ?? [])
    return `${days} · ${task.start}–${task.end}`
  }
  if (task.kind === 'recurring') return `${weekdaysLabel(task.weekdays ?? [])} · ${duration}${period}`
  return `Até ${shortDateLabel(fromIsoDate(task.deadline ?? ''))} · ${duration} no total${period}`
}
