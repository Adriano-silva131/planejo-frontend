import { describe, expect, it } from 'vitest'
import { quickAddKind, quickAddProblem, toQuickAddPayload, type QuickAddValues } from './quickAdd'

const values = (fields: Partial<QuickAddValues> = {}): QuickAddValues => ({
  title: 'Vôlei', date: '2026-11-14', start: '', end: '', area: 'Saúde', ...fields,
})

describe('toQuickAddPayload', () => {
  it('com horário, vira compromisso naquele dia', () => {
    const appointment = values({ start: '16:00', end: '18:00' })
    expect(quickAddKind(appointment)).toBe('appointment')
    expect(toQuickAddPayload(appointment)).toEqual({ title: 'Vôlei', area: 'Saúde', kind: 'fixed', date: '2026-11-14', start: '16:00', end: '18:00' })
  })

  it('sem horário, vira prazo até o dia escolhido', () => {
    expect(quickAddKind(values({ title: ' Relatório ' }))).toBe('deadline')
    expect(toQuickAddPayload(values({ title: ' Relatório ' }))).toEqual({
      title: 'Relatório', area: 'Saúde', kind: 'one_off', priority: 'medium', deadline: '2026-11-14',
    })
  })
})

describe('quickAddProblem', () => {
  it('pede o que falta, um campo por vez', () => {
    expect(quickAddProblem(values({ title: ' ' }))?.field).toBe('title')
    expect(quickAddProblem(values({ start: '16:00' }))).toEqual({ field: 'end', message: 'Informe o início e o fim, ou apague os dois para virar prazo.' })
    expect(quickAddProblem(values({ start: '16:00', end: '16:00' }))?.field).toBe('end')
    expect(quickAddProblem(values({ area: '' }))?.field).toBe('area')
    expect(quickAddProblem(values())).toBeUndefined()
  })
})
