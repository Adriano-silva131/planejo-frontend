import { describe, expect, it } from 'vitest'
import { fromIsoDate, toIsoDate } from './calendarDate'

describe('calendarDate', () => {
  it('usa a data local, sem deslocar pelo fuso', () => {
    expect(toIsoDate(new Date(2026, 9, 27, 23, 59))).toBe('2026-10-27')
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('volta para o mesmo dia', () => {
    const date = fromIsoDate('2026-10-27')
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 27])
  })
})
