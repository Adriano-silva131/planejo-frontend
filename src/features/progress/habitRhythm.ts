import type { Habit, HabitWeek } from './api/progressTypes'

export const shownWeeks = 6

export type HabitRhythm = {
  week?: HabitWeek
  weeks: Array<HabitWeek | undefined>
  status: string
  doneToday: boolean
}

// weeks traz as últimas semanas da mais antiga para a mais nova; hábito novo tem menos e completa à esquerda.
export function habitRhythm(habit: Habit, weekStart: string, today: string): HabitRhythm {
  const sorted = [...(habit.weeks ?? [])].sort((a, b) => a.start.localeCompare(b.start)).slice(-shownWeeks)
  const week = sorted.find((item) => item.start === weekStart)
  return {
    week,
    weeks: [...Array<undefined>(shownWeeks - sorted.length).fill(undefined), ...sorted],
    status: statusText(week),
    doneToday: (week?.days ?? []).some((day) => day.date === today && day.done),
  }
}

export function rhythmsOnTrack(habits: Habit[], weekStart: string) {
  const weeks = habits.map((habit) => habit.weeks?.find((week) => week.start === weekStart)).filter((week) => week && week.target > 0)
  return { met: weeks.filter((week) => week?.met).length, total: weeks.length }
}

function statusText(week?: HabitWeek) {
  if (!week || week.target === 0) return 'sem meta nesta semana'
  if (week.met) return 'meta cumprida'
  const left = week.target - week.done
  return left === 1 ? 'falta 1' : `faltam ${left}`
}
