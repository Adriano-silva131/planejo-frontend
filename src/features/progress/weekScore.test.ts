import { describe, expect, it } from 'vitest'
import type { WeekProgress } from './api/progressTypes'
import { weekScore } from './weekScore'

const item = (expected: number, done: number) => ({ taskId: String(expected), title: '', expected, done, days: [] })

describe('weekScore', () => {
  it('soma o feito e o pedido das recorrentes, sem passar da meta de cada uma', () => {
    const progress = { start: '', end: '', recurring: [item(3, 0), item(4, 3), item(2, 5)], oneOff: [] } as WeekProgress
    expect(weekScore(progress)).toEqual({ done: 5, total: 9 })
  })

  it('sem recorrentes, zero de zero', () => {
    expect(weekScore({ start: '', end: '', recurring: null, oneOff: null } as WeekProgress)).toEqual({ done: 0, total: 0 })
  })
})
