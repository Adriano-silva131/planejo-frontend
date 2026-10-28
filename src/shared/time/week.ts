import { toIsoDate } from './calendarDate'

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function startOfWeek(date: Date) {
  const monday = addDays(date, -((date.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function weekDays(start: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export function shortDateLabel(date: Date) {
  return shortDate.format(date).replace('.', '').replace(' de ', ' ')
}

export function weekRangeLabel(start: Date) {
  return `${shortDateLabel(start)} – ${shortDateLabel(addDays(start, 6))}`
}

export function isSameWeek(a: Date, b: Date) {
  return toIsoDate(startOfWeek(a)) === toIsoDate(startOfWeek(b))
}
