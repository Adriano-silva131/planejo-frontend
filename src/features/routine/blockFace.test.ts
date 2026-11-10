import { describe, expect, it } from 'vitest'
import { blockSize, extrasLabel } from './blockFace'

describe('blockSize', () => {
  it('abaixo de 30 minutos o título não cabe; até 45, cabe uma linha', () => {
    expect(blockSize(15)).toBe('tiny')
    expect(blockSize(29)).toBe('tiny')
    expect(blockSize(30)).toBe('short')
    expect(blockSize(44)).toBe('short')
    expect(blockSize(45)).toBe('regular')
  })
})

describe('extrasLabel', () => {
  it('diz o nome de um bloco junto e a contagem de mais de um', () => {
    expect(extrasLabel([{ title: 'Limpeza' }])).toBe('+ Limpeza')
    expect(extrasLabel([{ title: 'Limpeza' }, { title: 'Leitura' }])).toBe('+ 2')
  })
})
