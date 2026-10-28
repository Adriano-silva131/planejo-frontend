import { describe, expect, it } from 'vitest'
import { toIsoDate } from './calendarDate'
import { addDays, isSameWeek, startOfWeek, weekDays, weekRangeLabel } from './week'

describe('startOfWeek', () => {
  it('volta para a segunda-feira', () => {
    expect(toIsoDate(startOfWeek(new Date(2026, 9, 27)))).toBe('2026-10-26')
    expect(toIsoDate(startOfWeek(new Date(2026, 10, 1)))).toBe('2026-10-26')
    expect(toIsoDate(startOfWeek(new Date(2026, 9, 26)))).toBe('2026-10-26')
  })
})

describe('weekDays', () => {
  it('lista de segunda a domingo', () => {
    expect(weekDays(new Date(2026, 9, 26)).map(toIsoDate)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ])
  })
})

describe('weekRangeLabel', () => {
  it('escreve o intervalo curto', () => {
    expect(weekRangeLabel(new Date(2026, 9, 26))).toBe('26 out – 1 nov')
  })
})

describe('isSameWeek', () => {
  it('compara pela segunda-feira', () => {
    expect(isSameWeek(new Date(2026, 9, 26), new Date(2026, 10, 1))).toBe(true)
    expect(isSameWeek(new Date(2026, 9, 26), addDays(new Date(2026, 10, 1), 1))).toBe(false)
  })
})
