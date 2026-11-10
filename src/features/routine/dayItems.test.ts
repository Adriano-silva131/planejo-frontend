import { describe, expect, it } from 'vitest'
import type { PlannedBlock, PlannedDay } from './api/routineTypes'
import { dayItems, freeGaps, longestGap, nextBreak } from './dayItems'
import { dayLineRange, hourMarks, place } from './dayLine'

function block(title: string, start: string, end: string, taskKind: PlannedBlock['taskKind'] = 'fixed'): PlannedBlock {
  return {
    taskId: title,
    title,
    area: 'Trabalho',
    start,
    end,
    adjusted: false,
    continuesFromPreviousDay: false,
    continuesNextDay: false,
    taskKind,
  }
}

const at = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))

const day: PlannedDay = {
  date: '2026-10-28',
  weekday: 'wednesday',
  blocks: [block('Almoço', '12:00', '13:00'), block('Faculdade', '19:00', '20:00'), block('Inglês', '14:00', '16:00', 'recurring')],
}

describe('dayItems', () => {
  it('põe fixas e sessões em ordem de início', () => {
    expect(dayItems(day).map((item) => [item.block.title, item.start])).toEqual([
      ['Almoço', at('12:00')],
      ['Inglês', at('14:00')],
      ['Faculdade', at('19:00')],
    ])
  })
})

describe('janelas livres', () => {
  const items = dayItems(day)

  it('lista o que sobra a partir de agora, até a meia-noite', () => {
    expect(freeGaps(items, at('12:20'))).toEqual([
      { start: at('13:00'), end: at('14:00') },
      { start: at('16:00'), end: at('19:00') },
      { start: at('20:00'), end: 1440 },
    ])
  })

  it('o próximo respiro ignora janelas curtas', () => {
    expect(nextBreak(items, at('12:20'), 90)).toEqual({ start: at('16:00'), end: at('19:00') })
  })

  it('a maior janela é a noite', () => {
    expect(longestGap(items, at('12:20'))).toEqual({ start: at('20:00'), end: 1440 })
  })
})

describe('linha do dia', () => {
  it('começa às 7h e vai até a meia-noite', () => {
    const range = dayLineRange(dayItems(day))
    expect(range).toEqual({ startHour: 7, columns: 204 })
    expect(place(range, at('12:00'), at('13:00'))).toEqual({ colStart: 61, colSpan: 12 })
    expect(hourMarks(range)).toEqual([7, 9, 11, 13, 15, 17, 19, 21])
  })

  it('começa antes quando algo começa cedo e não passa do fim', () => {
    const range = dayLineRange(dayItems({ ...day, blocks: [block('Plantão', '05:30', '24:00')] }))
    expect(range.startHour).toBe(5)
    expect(place(range, at('05:30'), 1440)).toEqual({ colStart: 7, colSpan: range.columns - 6 })
  })
})
