import { describe, expect, it } from 'vitest'
import type { DayPlanItem, PlannedBlock, PlannedDay } from './api/routineTypes'
import { boardDay, dayGlance, dayRoom, shortRangeLabel, showsPeriod } from './weekBoard'

const at = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
const flags = { adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }

function fixed(title: string, start: string, end: string): PlannedBlock {
  return { taskId: title, title, area: 'Trabalho', taskKind: 'fixed', start, end, ...flags }
}

function session(title: string, start: string, end: string, done?: boolean): PlannedBlock {
  return { taskId: title, title, area: 'Estudos', taskKind: 'recurring', start, end, done, ...flags }
}

function plan(title: string, fields: Partial<DayPlanItem> = {}): DayPlanItem {
  return { taskId: title, title, area: 'Programação', taskKind: 'recurring', source: 'usual', minutes: 60, done: false, ...fields }
}

const weekday = [fixed('Olist', '09:00', '18:00'), fixed('Almoço', '12:00', '13:00'), fixed('Faculdade', '19:00', '20:00')]

function day(date: string, blocks: PlannedBlock[], plans: DayPlanItem[] = []): PlannedDay {
  return { date, weekday: '', blocks, plans }
}

const periodOf = (board: ReturnType<typeof boardDay>, id: string) => board.periods.find((period) => period.id === id)!

describe('boardDay', () => {
  it('põe cada fixo no período em que começa e conta o livre de cada período', () => {
    const board = boardDay(day('2026-11-16', weekday), '2026-11-14', 0)

    expect(periodOf(board, 'morning').fixed.map((block) => block.title)).toEqual(['Olist'])
    expect(periodOf(board, 'afternoon').fixed.map((block) => block.title)).toEqual(['Almoço'])
    expect(periodOf(board, 'evening').fixed.map((block) => block.title)).toEqual(['Faculdade'])
    expect(board.periods.map((period) => period.freeMinutes)).toEqual([120, 0, 180])
  })

  it('separa o que vem sem horário por período, soma o que pede do livre e deixa o sem período no topo', () => {
    const plans = [
      plan('AWS', { period: 'evening' }),
      plan('Inglês', { period: 'evening', minutes: 25 }),
      plan('Leitura', { period: 'evening', minutes: 25, done: true }),
      plan('Corrida', { minutes: 30 }),
    ]
    const board = boardDay(day('2026-11-16', weekday, plans), '2026-11-14', 0)

    expect(periodOf(board, 'evening').plans.map((item) => item.title)).toEqual(['AWS', 'Inglês', 'Leitura'])
    expect(periodOf(board, 'evening').plannedMinutes).toBe(85)
    expect(board.loose.map((item) => item.title)).toEqual(['Corrida'])
  })

  it('hoje conta o livre a partir de agora', () => {
    const board = boardDay(day('2026-11-14', []), '2026-11-14', at('11:00'))
    expect(board.periods.map((period) => period.freeMinutes)).toEqual([60, 360, 240])
  })

  it('num dia que passou mostra só o feito e os fixos, sem livre', () => {
    const plans = [plan('Academia', { period: 'morning', source: 'checkin', done: true }), plan('AWS', { period: 'evening' })]
    const blocks = [...weekday, session('Inglês', '20:00', '20:25', false), session('Leitura', '21:00', '21:25', true)]
    const board = boardDay(day('2026-11-10', blocks, plans), '2026-11-14', 0)

    expect(periodOf(board, 'morning').plans.map((item) => item.title)).toEqual(['Academia'])
    expect(periodOf(board, 'evening').plans).toEqual([])
    expect(periodOf(board, 'evening').sessions.map((block) => block.title)).toEqual(['Leitura'])
    expect(board.periods.every((period) => period.freeMinutes === undefined)).toBe(true)
  })
})

describe('dayRoom', () => {
  it('soma o livre que sobra em cada período, sem deixar um período cheio demais tirar dos outros', () => {
    const plans = [plan('AWS', { period: 'evening', minutes: 240 })]
    expect(dayRoom(boardDay(day('2026-11-16', weekday, plans), '2026-11-14', 0))).toBe(120)
    expect(dayRoom(boardDay(day('2026-11-10', weekday), '2026-11-14', 0))).toBeUndefined()
  })
})

describe('dayGlance', () => {
  it('lista o que o dia tem na ordem do quadro', () => {
    const board = boardDay(day('2026-11-16', weekday, [plan('Corrida', {}), plan('AWS', { period: 'evening' })]), '2026-11-14', 0)
    expect(dayGlance(board).map((item) => item.title)).toEqual(['Corrida', 'Olist', 'Almoço', 'Faculdade', 'AWS'])
  })
})

describe('showsPeriod', () => {
  it('esconde o período vazio sem tempo livre', () => {
    const past = boardDay(day('2026-11-15', []), '2026-11-16', 0)
    const weekdayBoard = boardDay(day('2026-11-16', [fixed('Olist', '09:00', '18:00')]), '2026-11-14', 0)

    expect(past.periods.some(showsPeriod)).toBe(false)
    expect(showsPeriod(periodOf(weekdayBoard, 'afternoon'))).toBe(false)
    expect(showsPeriod(periodOf(weekdayBoard, 'evening'))).toBe(true)
  })
})

describe('shortRangeLabel', () => {
  it('escreve horas cheias sem minutos', () => {
    expect(shortRangeLabel({ start: '09:00', end: '18:00' })).toBe('9h–18h')
    expect(shortRangeLabel({ start: '18:45', end: '19:45' })).toBe('18:45–19:45')
  })
})
