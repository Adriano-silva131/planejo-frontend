import { describe, expect, it } from 'vitest'
import { formatDuration, minutesOfDay, minutesSinceMidnight } from './timeOfDay'

describe('minutesOfDay', () => {
  it('converte HH:MM em minutos desde a meia-noite', () => {
    expect(minutesOfDay('00:00')).toBe(0)
    expect(minutesOfDay('09:30')).toBe(570)
    expect(minutesOfDay('24:00')).toBe(1440)
  })
})

describe('minutesSinceMidnight', () => {
  it('lê a hora local da data', () => {
    expect(minutesSinceMidnight(new Date(2026, 9, 27, 18, 45))).toBe(1125)
  })
})

describe('formatDuration', () => {
  it.each([
    [45, '45 min'],
    [60, '1 h'],
    [90, '1 h 30'],
    [125, '2 h 05'],
    [0, '0 min'],
  ])('%i minutos viram "%s"', (minutes, label) => {
    expect(formatDuration(minutes)).toBe(label)
  })
})
