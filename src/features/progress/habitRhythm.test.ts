import { describe, expect, it } from 'vitest'
import type { Habit, HabitWeek } from './api/progressTypes'
import { habitRhythm, rhythmsOnTrack } from './habitRhythm'

function week(start: string, done: number, target: number, days: HabitWeek['days'] = []): HabitWeek {
  return { start, done, target, met: done >= target, days }
}

function habit(title: string, weeks: HabitWeek[]): Habit {
  return { taskId: title, title, area: 'Saúde', streak: 0, timesPerWeek: 3, weekdays: [], weeks }
}

describe('habitRhythm', () => {
  it('completa as semanas que faltam à esquerda e diz quanto falta', () => {
    const rhythm = habitRhythm(
      habit('Academia', [week('2026-10-26', 1, 3, [{ date: '2026-10-28', done: true, scheduled: true }]), week('2026-10-19', 3, 3)]),
      '2026-10-26',
      '2026-10-28',
    )
    expect(rhythm.weeks.map((item) => item?.start)).toEqual([undefined, undefined, undefined, undefined, '2026-10-19', '2026-10-26'])
    expect(rhythm.status).toBe('faltam 2')
    expect(rhythm.doneToday).toBe(true)
  })

  it('meta cumprida', () => {
    expect(habitRhythm(habit('Corrida', [week('2026-10-26', 2, 2)]), '2026-10-26', '2026-10-28').status).toBe('meta cumprida')
  })
})

describe('rhythmsOnTrack', () => {
  it('conta os ritmos com meta cumprida na semana', () => {
    const habits = [habit('A', [week('2026-10-26', 2, 2)]), habit('B', [week('2026-10-26', 0, 2)]), habit('C', [week('2026-10-26', 0, 0)])]
    expect(rhythmsOnTrack(habits, '2026-10-26')).toEqual({ met: 1, total: 2 })
  })
})
