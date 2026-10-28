import { describe, expect, it } from 'vitest'
import type { RoutineBlock } from './api/routineTypes'
import { planDay } from './dayPlan'

function block(title: string, start: string, end: string, extra: Partial<RoutineBlock> = {}): RoutineBlock {
  return {
    taskId: title,
    title,
    area: 'Trabalho',
    start,
    end,
    adjusted: false,
    continuesFromPreviousDay: false,
    continuesNextDay: false,
    ...extra,
  }
}

const work = block('Trabalho', '09:00', '12:00')
const gym = block('Academia', '18:30', '19:30')
const study = block('Estudar', '20:00', '20:45')
const at = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))

describe('planDay', () => {
  it('destaca o bloco em andamento e lista os seguintes', () => {
    const plan = planDay([work, gym, study], at('10:00'))
    expect(plan.highlight).toEqual({ block: work, isNow: true })
    expect(plan.rest).toEqual([gym, study])
  })

  it('sem bloco agora, destaca o próximo', () => {
    const plan = planDay([work, gym, study], at('13:00'))
    expect(plan.highlight).toEqual({ block: gym, isNow: false })
    expect(plan.rest).toEqual([study])
  })

  it('depois do último bloco, não destaca nada', () => {
    const plan = planDay([work, gym], at('21:00'))
    expect(plan.highlight).toBeUndefined()
    expect(plan.rest).toEqual([])
    expect(plan.freeMinutes).toBe(180)
  })

  it('dia vazio deixa todo o resto livre', () => {
    expect(planDay([], at('08:00'))).toEqual({ highlight: undefined, rest: [], freeMinutes: 960 })
  })

  it('conta só o que falta do bloco em andamento', () => {
    expect(planDay([work, gym], at('11:00')).freeMinutes).toBe(1440 - at('11:00') - 60 - 60)
  })

  it('não conta duas vezes blocos sobrepostos', () => {
    const meeting = block('Reunião', '10:00', '11:00')
    expect(planDay([work, meeting], at('08:00')).freeMinutes).toBe(1440 - at('08:00') - 180)
  })

  it('bloco que passa da meia-noite ocupa até o fim do dia', () => {
    const night = block('Plantão', '22:00', '24:00', { continuesNextDay: true })
    const plan = planDay([night], at('23:00'))
    expect(plan.highlight).toEqual({ block: night, isNow: true })
    expect(plan.freeMinutes).toBe(0)
  })
})
