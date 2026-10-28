import { describe, expect, it } from 'vitest'
import { areaCategoryColors, areaCategoryId, areaColor, areaKey } from './areaColors'

describe('areaKey', () => {
  it('ignora acentos, caixa e símbolos', () => {
    expect(areaKey('Saúde')).toBe('saude')
    expect(areaKey('  Lazer & Social ')).toBe('lazer-social')
    expect(areaKey('!!!')).toBe('sem-area')
  })
})

describe('areaColor', () => {
  it('usa as cores do guia nas áreas conhecidas', () => {
    expect(areaColor('Trabalho')).toBe('#386cc0')
    expect(areaColor('estudos')).toBe('#7b5cc4')
    expect(areaColor('SAÚDE')).toBe('#e08a5c')
  })

  it('dá sempre a mesma cor para a mesma área nova', () => {
    expect(areaColor('Música')).toBe(areaColor('musica'))
    expect(areaColor('Música')).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('areaCategoryColors', () => {
  it('gera um id seguro por área, sem repetir', () => {
    const colors = areaCategoryColors(['Saúde', 'saude', 'Trabalho'])
    expect(colors.map((color) => color.id)).toEqual(['area-saude', 'area-trabalho'])
    expect(areaCategoryId('Lazer e social')).toMatch(/^[\w-]+$/)
  })
})
