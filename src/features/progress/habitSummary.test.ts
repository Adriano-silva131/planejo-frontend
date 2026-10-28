import { describe, expect, it } from 'vitest'
import type { HabitWeek } from './api/progressTypes'
import { habitProgressText } from './habitSummary'

function week(done: number, target: number): HabitWeek {
  return { start: '2026-10-26', days: [], done, target, met: done >= target }
}

describe('habitProgressText', () => {
  it('diz quanto falta na semana em andamento', () => {
    expect(habitProgressText(0, week(1, 3))).toBe('Faltam 2 esta semana')
    expect(habitProgressText(0, week(1, 2))).toBe('Falta 1 esta semana')
  })

  it('junta a sequência com o que falta', () => {
    expect(habitProgressText(2, week(0, 3))).toBe('2 semanas seguidas · Faltam 3 esta semana')
  })

  it('mostra só a sequência quando a semana já foi cumprida', () => {
    expect(habitProgressText(1, week(3, 2))).toBe('1 semana seguida')
  })

  it('sem semana em andamento e sem sequência', () => {
    expect(habitProgressText(0, undefined)).toBe('Sem sequência')
  })
})
