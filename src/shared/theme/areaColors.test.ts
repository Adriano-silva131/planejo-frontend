import { describe, expect, it } from 'vitest'
import { areaCategoryColors, areaCategoryId, areaKey, defaultAreaColor } from './areaColors'

describe('areaKey', () => {
  it('ignora acentos, caixa e símbolos', () => {
    expect(areaKey('Saúde')).toBe('saude')
    expect(areaKey('  Lazer & Social ')).toBe('lazer-social')
    expect(areaKey('!!!')).toBe('sem-area')
  })
})

describe('defaultAreaColor', () => {
  it('usa as cores do guia nas áreas conhecidas', () => {
    expect(defaultAreaColor('Trabalho')).toBe('#386cc0')
    expect(defaultAreaColor('estudos')).toBe('#7b5cc4')
    expect(defaultAreaColor('SAÚDE')).toBe('#e08a5c')
  })

  it('dá sempre a mesma cor para a mesma área nova', () => {
    expect(defaultAreaColor('Música')).toBe(defaultAreaColor('musica'))
    expect(defaultAreaColor('Música')).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('areaCategoryColors', () => {
  it('gera um id seguro por área, sem repetir', () => {
    const colors = areaCategoryColors([{ area: 'Saúde' }, { area: 'saude' }, { area: 'Trabalho' }])
    expect(colors.map((color) => color.id)).toEqual(['area-saude', 'area-trabalho'])
    expect(areaCategoryId('Lazer e social')).toMatch(/^[\w-]+$/)
  })

  it('usa a cor escolhida pelo usuário e a proposta só nas áreas sem escolha', () => {
    const colors = areaCategoryColors([{ area: 'Trabalho', color: '#ff0000' }, { area: 'Música' }])
    expect(colors).toEqual([
      { id: 'area-trabalho', color: '#ff0000' },
      { id: 'area-musica', color: defaultAreaColor('Música') },
    ])
  })

  it('prefere a cor escolhida entre grafias da mesma área', () => {
    const colors = areaCategoryColors([{ area: 'saude' }, { area: 'Saúde', color: '#123456' }, { area: 'SAÚDE', color: '#654321' }])
    expect(colors).toEqual([{ id: 'area-saude', color: '#123456' }])
  })
})
