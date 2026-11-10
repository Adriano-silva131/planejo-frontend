import { describe, expect, it } from 'vitest'
import { sessionDefaults, sessionFormSchema } from './sessionForm'

const issues = (kind: 'recurring' | 'one_off', values: unknown) =>
  sessionFormSchema(kind).safeParse(values).error?.issues.map((issue) => [issue.path[0], issue.message]) ?? []

describe('sessionFormSchema', () => {
  it('pede o dia em português mesmo quando nenhum está marcado', () => {
    expect(issues('recurring', { date: null, start: '13:30', end: '' })).toEqual([['date', 'Escolha o dia.']])
  })

  it('deixa o fim opcional só na recorrente', () => {
    expect(issues('recurring', { date: '2026-10-31', start: '13:30', end: '' })).toEqual([])
    expect(issues('one_off', { date: '2026-10-31', start: '13:30', end: '' })).toEqual([['end', 'Informe até quando.']])
  })
})

describe('sessionDefaults', () => {
  it('já começa no primeiro dia disponível', () => {
    expect(sessionDefaults(['2026-10-31', '2026-11-01']).date).toBe('2026-10-31')
  })

  it('traz a sessão encaixada, com meia-noite como 00:00', () => {
    expect(sessionDefaults(['2026-10-31'], { date: '2026-10-31', start: '22:00', end: '24:00' })).toEqual({
      date: '2026-10-31',
      start: '22:00',
      end: '00:00',
    })
  })
})
