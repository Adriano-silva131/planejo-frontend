import { describe, expect, it } from 'vitest'
import type { Habit, HabitsOutput } from './api/progressTypes'
import { weekRhythm } from './weekRhythm'

function habit(title: string, weeks: Array<[start: string, done: number, target: number]>): Habit {
  return {
    taskId: title,
    title,
    area: 'Saúde',
    streak: 0,
    timesPerWeek: 3,
    weekdays: [],
    weeks: weeks.map(([start, done, target]) => ({ start, done, target, met: done >= target, days: [] })),
  }
}

describe('weekRhythm', () => {
  it('usa a semana de referência de cada hábito', () => {
    const output: HabitsOutput = {
      weekStart: '2026-10-26',
      habits: [
        habit('Academia', [['2026-10-19', 3, 3], ['2026-10-26', 2, 3]]),
        habit('Corrida', [['2026-10-26', 2, 2]]),
      ],
    }
    expect(weekRhythm(output)).toEqual([
      { taskId: 'Academia', title: 'Academia', area: 'Saúde', done: 2, target: 3, met: false },
      { taskId: 'Corrida', title: 'Corrida', area: 'Saúde', done: 2, target: 2, met: true },
    ])
  })

  it('deixa de fora hábito sem meta na semana', () => {
    const output: HabitsOutput = { weekStart: '2026-10-26', habits: [habit('Leitura', [['2026-10-26', 0, 0]])] }
    expect(weekRhythm(output)).toEqual([])
  })
})
