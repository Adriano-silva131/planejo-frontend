import type { HabitWeek } from './api/progressTypes'

export function streakText(streak: number) {
  if (streak === 0) return null
  return streak === 1 ? '1 semana seguida' : `${streak} semanas seguidas`
}

export function remainingText(week: HabitWeek | undefined) {
  if (!week || week.met) return null
  const remaining = Math.max(week.target - week.done, 0)
  return remaining === 1 ? 'Falta 1 esta semana' : `Faltam ${remaining} esta semana`
}

// Sem sequência e sem semana em andamento só acontece olhando uma semana passada.
export function habitProgressText(streak: number, ongoingWeek: HabitWeek | undefined) {
  const parts = [streakText(streak), remainingText(ongoingWeek)].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Sem sequência'
}
