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

// A data ISO do parâmetro, se for um dos sete dias da semana que começa em start.
export function dateInWeek(raw: string | null, start: Date) {
  return weekDays(start)
    .map(toIsoDate)
    .find((date) => date === raw)
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

// Semana ISO 8601: começa na segunda e a primeira é a que contém a primeira quinta-feira do ano.
export function isoWeekNumber(date: Date) {
  const thursday = addDays(startOfWeek(date), 3)
  const firstThursday = addDays(startOfWeek(new Date(thursday.getFullYear(), 0, 4)), 3)
  return Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
}

export function relativeWeekLabel(start: Date, now: Date) {
  const weeks = Math.round((startOfWeek(start).getTime() - startOfWeek(now).getTime()) / (7 * 24 * 60 * 60 * 1000))
  if (weeks === 0) return 'Esta semana'
  if (weeks === -1) return 'Semana passada'
  if (weeks === 1) return 'Próxima semana'
  return weekRangeLabel(start)
}
