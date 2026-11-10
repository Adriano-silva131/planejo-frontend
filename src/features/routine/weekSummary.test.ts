import { describe, expect, it } from 'vitest'
import type { PlannedBlock, PlannedDay } from './api/routineTypes'
import { dayFree, freeGapLabels, freeStretch, plannedByArea, todayFree, weekFreeMinutes } from './weekSummary'

const range = { startHour: 7, endHour: 22 }
const at = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))

function block(title: string, area: string, start: string, end: string): PlannedBlock {
  return { taskId: title, title, area, taskKind: 'fixed', start, end, adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
}

function day(date: string, blocks: PlannedBlock[]): PlannedDay {
  return { date, weekday: '', blocks }
}

const monday = day('2026-10-26', [block('Almoço', 'Alimentação', '12:00', '13:00')])
const wednesday = day('2026-10-28', [
  block('Almoço', 'Alimentação', '12:00', '13:00'),
  block('Faculdade', 'Estudos', '19:00', '20:00'),
])
const sunday = day('2026-11-01', [])

describe('dayFree', () => {
  it('conta do início ao fim da grade, não até a meia-noite', () => {
    expect(dayFree(monday, range, '2026-10-28', at('12:20'))).toMatchObject({ freeMinutes: 15 * 60 - 60, busyMinutes: 60, isPast: true })
  })

  it('hoje conta a partir de agora', () => {
    expect(dayFree(wednesday, range, '2026-10-28', at('12:20'))).toMatchObject({
      freeMinutes: at('22:00') - at('12:20') - 40 - 60,
      windowMinutes: at('22:00') - at('12:20'),
      isPast: false,
    })
  })

  it('depois do fim da grade não sobra nada, e o que passa do fim não conta', () => {
    const late = day('2026-10-28', [block('Série', 'Lazer', '21:00', '23:00')])
    expect(dayFree(late, range, '2026-10-28', at('21:30'))).toMatchObject({ freeMinutes: 0, busyMinutes: 30 })
    expect(dayFree(late, range, '2026-10-28', at('23:30'))).toMatchObject({ freeMinutes: 0, windowMinutes: 0 })
  })

  it('dia sem blocos fica vazio e todo livre', () => {
    expect(dayFree(sunday, range, '2026-10-28', 0)).toMatchObject({ freeMinutes: 15 * 60, isEmpty: true })
  })
})

describe('todayFree', () => {
  it('usa a grade da semana, que cresce quando algo termina mais tarde', () => {
    const late = day('2026-10-29', [block('Plantão', 'Trabalho', '20:00', '23:00')])
    expect(todayFree([wednesday, late], '2026-10-28', at('12:20'))?.freeMinutes).toBe(at('23:00') - at('12:20') - 40 - 60)
    expect(todayFree([wednesday], '2026-10-30', at('12:20'))).toBeUndefined()
  })
})

describe('weekFreeMinutes', () => {
  it('na semana atual soma só o que ainda vem', () => {
    const days = [monday, wednesday].map((item) => dayFree(item, range, '2026-10-28', at('12:20')))
    expect(weekFreeMinutes(days)).toBe(days[1].freeMinutes)
  })

  it('numa semana passada soma tudo', () => {
    const days = [monday, wednesday].map((item) => dayFree(item, range, '2026-11-05', 0))
    expect(weekFreeMinutes(days)).toBe(days[0].freeMinutes + days[1].freeMinutes)
  })
})

describe('plannedByArea', () => {
  it('soma por área, da maior para a menor', () => {
    expect(plannedByArea([monday, wednesday])).toEqual([
      { area: 'Alimentação', minutes: 120 },
      { area: 'Estudos', minutes: 60 },
    ])
  })
})

describe('freeStretch', () => {
  it('nomeia o maior trecho livre pelo período do meio', () => {
    expect(freeStretch(wednesday, range, at('07:00'))).toEqual({ start: at('13:00'), end: at('19:00'), label: 'Tarde livre' })
  })

  it('ignora trechos curtos', () => {
    expect(freeStretch(wednesday, range, at('16:00'))).toBeUndefined()
  })

  it('mostra o dia vazio como Livre no que resta da faixa visível', () => {
    expect(freeStretch(sunday, range, 0)).toEqual({ start: range.startHour * 60, end: range.endHour * 60, label: 'Livre' })
    expect(freeStretch(sunday, range, at('20:00'))).toMatchObject({ start: at('20:00'), label: 'Livre' })
    expect(freeStretch(sunday, range, range.endHour * 60)).toBeUndefined()
  })
})

describe('freeGapLabels', () => {
  it('rotula cada trecho livre de 30 minutos ou mais na faixa visível, a partir de quando conta', () => {
    expect(freeGapLabels(wednesday, range, at('07:00')).map((gap) => gap.label)).toContain('6 h livres')
    expect(freeGapLabels(sunday, range, at('20:00'))).toEqual([{ start: at('20:00'), end: at('22:00'), label: '2 h livres' }])
    expect(freeGapLabels(sunday, range, at('21:40'))).toEqual([])
  })
})
