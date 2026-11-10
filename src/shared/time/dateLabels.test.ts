import { describe, expect, it } from 'vitest'
import { daysLeftLabel, longDateLabel, shortWeekdayLabel, weekdayIn, weekdayInitial, weekdayOf } from './dateLabels'

describe('dateLabels', () => {
  it('escreve a data sem o "-feira"', () => {
    expect(longDateLabel(new Date(2026, 9, 27))).toBe('terça, 27 de outubro')
    expect(longDateLabel(new Date(2026, 10, 1))).toBe('domingo, 1 de novembro')
  })

  it('usa a inicial do dia da semana', () => {
    expect(weekdayInitial(new Date(2026, 9, 26))).toBe('S')
    expect(weekdayInitial(new Date(2026, 9, 28))).toBe('Q')
  })

  it('abrevia o dia da semana', () => {
    expect(shortWeekdayLabel(new Date(2026, 9, 26))).toBe('Seg')
    expect(shortWeekdayLabel(new Date(2026, 9, 31))).toBe('Sáb')
  })

  it('diz quanto falta até o prazo', () => {
    expect([-1, 0, 1, 5].map(daysLeftLabel)).toEqual(['atrasada', 'hoje', 'amanhã', 'em 5 dias'])
  })
})

describe('weekdayIn e weekdayOf', () => {
  it('usa na/da nos dias úteis e no/do no fim de semana', () => {
    expect(weekdayIn(new Date(2026, 10, 10))).toBe('na terça')
    expect(weekdayOf(new Date(2026, 10, 10))).toBe('da terça')
    expect(weekdayIn(new Date(2026, 10, 14))).toBe('no sábado')
    expect(weekdayOf(new Date(2026, 10, 15))).toBe('do domingo')
  })
})
