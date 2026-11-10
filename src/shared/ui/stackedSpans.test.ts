import { describe, expect, it } from 'vitest'
import { stackedSpans } from './stackedSpans'

describe('stackedSpans', () => {
  it('reparte as colunas sem sobra', () => {
    const spans = stackedSpans([720, 300, 270, 135, 60], 48)
    expect(spans.reduce((sum, span) => sum + span, 0)).toBe(48)
    expect(spans[0]).toBeGreaterThan(spans[1])
  })

  it('valor pequeno ainda aparece', () => {
    expect(stackedSpans([1000, 1], 48)[1]).toBe(1)
  })

  it('sem valores, nada', () => {
    expect(stackedSpans([0, 0], 48)).toEqual([0, 0])
  })
})
