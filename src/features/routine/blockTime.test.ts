import { describe, expect, it } from 'vitest'
import type { RoutineBlock } from './api/routineTypes'
import { blockMinutes, blockTimeLabel } from './blockTime'

const base: RoutineBlock = {
  taskId: 't',
  title: 'Plantão',
  area: 'Trabalho',
  start: '22:00',
  end: '24:00',
  adjusted: false,
  continuesFromPreviousDay: false,
  continuesNextDay: false,
}

describe('blockTimeLabel', () => {
  it('mostra início e fim', () => {
    expect(blockTimeLabel({ ...base, start: '09:00', end: '18:00' })).toBe('09:00–18:00')
  })

  it('avisa quando o bloco atravessa a meia-noite', () => {
    expect(blockTimeLabel({ ...base, continuesNextDay: true })).toBe('22:00 até amanhã')
    expect(blockTimeLabel({ ...base, start: '00:00', end: '02:00', continuesFromPreviousDay: true })).toBe('até 02:00')
  })
})

describe('blockMinutes', () => {
  it('conta a parte do bloco que cai no dia', () => {
    expect(blockMinutes({ ...base, continuesNextDay: true })).toBe(120)
  })
})
