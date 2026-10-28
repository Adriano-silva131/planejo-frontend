import type { CategoryColor } from './categoryColors'

const knownAreas: Record<string, string> = {
  trabalho: '#386cc0',
  estudos: '#7b5cc4',
  saude: '#e08a5c',
  pessoal: '#5e9e6e',
  lazer: '#c9a227',
  'lazer-e-social': '#c9a227',
}

const palette = ['#386cc0', '#7b5cc4', '#e08a5c', '#5e9e6e', '#c9a227', '#2f9c9c', '#c45c8a', '#8a6d3b']

export function areaKey(area: string) {
  const key = area
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return key || 'sem-area'
}

export function areaCategoryId(area: string) {
  return `area-${areaKey(area)}`
}

export function areaColor(area: string) {
  const key = areaKey(area)
  return knownAreas[key] ?? palette[hash(key) % palette.length]
}

export function areaCategoryColors(areas: Iterable<string>): CategoryColor[] {
  const unique = new Map<string, CategoryColor>()
  for (const area of areas) unique.set(areaCategoryId(area), { id: areaCategoryId(area), color: areaColor(area) })
  return [...unique.values()]
}

function hash(text: string) {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}
