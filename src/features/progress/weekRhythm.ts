import type { HabitsOutput } from './api/progressTypes'

export type RhythmRow = {
  taskId: string
  title: string
  area: string
  done: number
  target: number
  met: boolean
}

// A semana de referência é a última de cada hábito; hábito sem meta nela não entra.
export function weekRhythm(output: HabitsOutput): RhythmRow[] {
  return (output.habits ?? []).flatMap((habit) => {
    const week = habit.weeks?.find((item) => item.start === output.weekStart)
    if (!week || week.target === 0) return []
    return [{ taskId: habit.taskId, title: habit.title, area: habit.area, done: week.done, target: week.target, met: week.met }]
  })
}
