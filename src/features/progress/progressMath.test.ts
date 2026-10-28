import { describe, expect, it } from 'vitest'
import { filledSegments } from './progressMath'

describe('filledSegments', () => {
  it('arredonda para o segmento mais próximo e não passa do total', () => {
    expect(filledSegments(90, 300)).toBe(3)
    expect(filledSegments(0, 300)).toBe(0)
    expect(filledSegments(400, 300)).toBe(10)
    expect(filledSegments(10, 0)).toBe(0)
  })
})
