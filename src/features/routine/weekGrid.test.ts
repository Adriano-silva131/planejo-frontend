import { describe, expect, it } from 'vitest'
import type { RoutineBlock, RoutineDay } from './api/routineTypes'
import { hourRow, initialScrollHour, layoutDay, rowCount, visibleHours } from './weekGrid'

function block(title: string, start: string, end: string): RoutineBlock {
  return { taskId: title, title, area: 'Trabalho', start, end, adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
}

const day = (blocks: RoutineBlock[] | null): RoutineDay => ({ date: '2026-10-26', weekday: 'monday', blocks })
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

  it('corta o que passa da faixa visível e garante ao menos uma linha', () => {
    const placed = layoutDay([block('a', '21:30', '24:00'), block('b', '08:00', '08:02')], range)
    expect(placed[0]).toMatchObject({ rowStart: 175, rowSpan: 6 })
    expect(placed[1].rowSpan).toBe(1)
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
