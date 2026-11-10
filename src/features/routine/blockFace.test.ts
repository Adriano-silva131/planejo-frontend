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

describe('blockSize no dia aberto', () => {
  it('a partir de 15 minutos cabe título e horário numa linha; a partir de 45, em duas', () => {
    expect(blockSize(14, 'day')).toBe('tiny')
    expect(blockSize(15, 'day')).toBe('line')
    expect(blockSize(44, 'day')).toBe('line')
    expect(blockSize(45, 'day')).toBe('stacked')
  })
})

describe('extrasLabel', () => {
  it('diz o nome de um bloco junto e a contagem de mais de um', () => {
    expect(extrasLabel([{ title: 'Limpeza' }])).toBe('+ Limpeza')
    expect(extrasLabel([{ title: 'Limpeza' }, { title: 'Leitura' }])).toBe('+ 2')
  })
})
