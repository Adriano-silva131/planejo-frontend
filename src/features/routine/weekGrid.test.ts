import { describe, expect, it } from 'vitest'
import type { RoutineBlock, PlannedDay } from './api/routineTypes'
import { hourRow, initialScrollHour, layoutDay, minuteAtOffset, rowCount, visibleHours } from './weekGrid'

function block(title: string, start: string, end: string): RoutineBlock {
  return { taskId: title, title, area: 'Trabalho', taskKind: 'fixed', start, end, adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
}

const day = (blocks: RoutineBlock[] | null): PlannedDay => ({ date: '2026-10-26', weekday: 'monday', blocks })
const range = { startHour: 7, endHour: 22 }

describe('visibleHours', () => {
  it('usa 07:00–22:00 quando cabe', () => {
    expect(visibleHours([day([block('a', '09:00', '18:00')]), day(null)])).toEqual(range)
  })

  it('abre a faixa para blocos cedo ou tarde', () => {
    expect(visibleHours([day([block('a', '05:30', '06:00'), block('b', '22:00', '23:10')])])).toEqual({ startHour: 5, endHour: 24 })
  })
})

describe('grade', () => {
  it('tem uma linha a cada 5 minutos', () => {
    expect(rowCount(range)).toBe(180)
    expect(hourRow(7, range)).toBe(1)
    expect(hourRow(8, range)).toBe(13)
  })
})

describe('layoutDay', () => {
  it('posiciona pelo horário e pela duração', () => {
    const [placed] = layoutDay([block('a', '09:00', '12:00')], range)
    expect(placed).toMatchObject({ rowStart: 25, rowSpan: 36, lane: 0, overlaps: false })
  })

  it('põe blocos sobrepostos lado a lado e reaproveita a faixa livre', () => {
    const placed = layoutDay([block('a', '09:00', '12:00'), block('b', '10:00', '11:00'), block('c', '12:00', '13:00')], range)
    expect(placed.map((item) => item.lane)).toEqual([0, 1, 0])
    expect(placed.map((item) => item.overlaps)).toEqual([true, true, false])
  })

  it('empilha pelo começo: quem começa depois fica por cima, mesmo reaproveitando a faixa 0', () => {
    const placed = layoutDay([block('a', '08:00', '10:00'), block('b', '09:00', '12:00'), block('c', '10:30', '11:00')], range)
    expect(placed.map(({ block: { title }, lane, layer }) => [title, lane, layer])).toEqual([
      ['a', 0, 0],
      ['b', 1, 1],
      ['c', 0, 2],
    ])
  })

  it('mantém duas camadas para a Olist com Almoço e Lanche, e blocos encostados não se sobrepõem', () => {
    const placed = layoutDay([block('olist', '09:00', '18:00'), block('almoço', '12:00', '13:00'), block('lanche', '13:00', '13:30')], range)
    expect(placed.map((item) => item.layer)).toEqual([0, 1, 1])
  })

  it('ordena a entrada e, no mesmo começo, deixa o mais longo embaixo', () => {
    const placed = layoutDay([block('almoço', '09:00', '10:00'), block('c', '11:00', '12:00'), block('olist', '09:00', '18:00')], range)
    expect(placed.map((item) => [item.block.title, item.lane, item.layer])).toEqual([
      ['olist', 0, 0],
      ['almoço', 1, 1],
      ['c', 1, 1],
    ])
  })

  it('não passa da última camada com dados antigos empilhados', () => {
    const placed = layoutDay(['a', 'b', 'c', 'd', 'e'].map((title) => block(title, '09:00', '10:00')), range)
    expect(Math.max(...placed.map((item) => item.layer))).toBe(3)
    expect(Math.max(...placed.map((item) => item.lane))).toBe(3)
  })

  it('põe lado a lado os que começam a menos de 30 minutos um do outro', () => {
    const placed = layoutDay([block('livro', '18:45', '19:45'), block('faculdade', '19:00', '19:45'), block('olist', '09:00', '18:00')], range)
    const sides = Object.fromEntries(placed.map((item) => [item.block.title, item.side]))
    expect(sides).toEqual({ olist: undefined, livro: 'left', faculdade: 'right' })
  })

  it('mantém a cascata quando o de baixo começa bem antes', () => {
    const placed = layoutDay([block('olist', '09:00', '18:00'), block('almoço', '12:00', '13:00'), block('reunião', '09:15', '09:45')], range)
    expect(placed.find((item) => item.block.title === 'almoço')?.side).toBeUndefined()
    expect(placed.find((item) => item.block.title === 'reunião')?.side).toBe('right')
  })

  it('corta o que passa da faixa visível e garante ao menos uma linha', () => {
    const placed = layoutDay([block('a', '21:30', '24:00'), block('b', '08:00', '08:02')], range)
    const byTitle = (title: string) => placed.find((item) => item.block.title === title)
    expect(byTitle('a')).toMatchObject({ rowStart: 175, rowSpan: 6 })
    expect(byTitle('b')?.rowSpan).toBe(1)
  })
})

describe('initialScrollHour', () => {
  it('abre uma hora antes de agora na semana atual', () => {
    expect(initialScrollHour({ startHour: 0, endHour: 24 }, 15)).toBe(14)
  })

  it('abre às 07:00 nas outras semanas, sem sair da faixa', () => {
    expect(initialScrollHour({ startHour: 0, endHour: 24 }, undefined)).toBe(7)
    expect(initialScrollHour(range, 3)).toBe(7)
    expect(initialScrollHour({ startHour: 0, endHour: 24 }, 0)).toBe(0)
  })
})

describe('minuteAtOffset', () => {
  const range = { startHour: 7, endHour: 22 }

  it('converte a altura em minuto do dia, de 15 em 15', () => {
    expect(minuteAtOffset(0, 720, range)).toBe(7 * 60)
    expect(minuteAtOffset(360, 720, range)).toBe(14 * 60 + 30)
    expect(minuteAtOffset(100, 720, range)).toBe(9 * 60)
  })

  it('não passa do fim da grade', () => {
    expect(minuteAtOffset(800, 720, range)).toBe(22 * 60 - 15)
  })
})
