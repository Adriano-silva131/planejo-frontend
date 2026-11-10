import { describe, expect, it } from 'vitest'
import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { PlannedBlock, PlannedDay } from '@/features/routine/api/routineTypes'
import type { Task } from '@/features/tasks/api/taskTypes'
import { toFitItems } from './toFitItems'

function task(id: string, area: string, durationMinutes?: number): Task {
  return { id, title: id, area, kind: 'recurring', durationMinutes, createdAt: '', updatedAt: '' } as Task
}

function session(taskId: string): PlannedBlock {
  return {
    taskId,
    title: taskId,
    area: 'Estudos',
    taskKind: 'recurring',
    start: '19:00',
    end: '21:00',
    adjusted: false,
    continuesFromPreviousDay: false,
    continuesNextDay: false,
  }
}

const week = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01']

function days(sessions: Record<string, PlannedBlock[]> = {}): PlannedDay[] {
  return week.map((date) => ({ date, weekday: '', blocks: sessions[date] ?? [] }))
}

const tasks = [task('Inglês', 'Estudos', 120), task('Leitura', 'Pessoal', 45), task('Finanças', 'Pessoal'), task('Relatório', 'Trabalho')]

const progress: WeekProgress = {
  start: '2026-10-26',
  end: '2026-11-01',
  recurring: [
    { taskId: 'Inglês', title: 'Inglês', done: 1, expected: 3, days: ['2026-10-27'] },
    { taskId: 'Leitura', title: 'Leitura', done: 2, expected: 2, days: [] },
  ],
  oneOff: [
    { taskId: 'Relatório', title: 'Relatório', deadline: '2026-11-20' },
    { taskId: 'Finanças', title: 'Finanças', deadline: '2026-10-31' },
    { taskId: 'Revisão', title: 'Revisão', deadline: '2026-10-29', completedOn: '2026-10-27' },
  ],
}

const today = '2026-10-28'

describe('toFitItems', () => {
  const items = toFitItems(progress, tasks, days(), today)

  it('lista o que falta, com a pontual de prazo perto primeiro e sem as concluídas', () => {
    expect(items.map((item) => item.task.taskId)).toEqual(['Finanças', 'Inglês', 'Relatório'])
  })

  it('descreve o prazo da pontual e quanto falta da recorrente', () => {
    expect(items[0]).toMatchObject({ detail: 'Prazo sáb', badge: 'em 3 dias', urgent: true, minutes: 60 })
    expect(items[1]).toMatchObject({ detail: '2 h · faltam 2 vezes', badge: '×2', urgent: false, minutes: 120 })
    expect(items[2]).toMatchObject({ badge: 'em 23 dias', urgent: false })
  })

  it('oferece os dias de hoje em diante', () => {
    expect(items[1].dates).toEqual(week.slice(2))
  })

  it('desconta as sessões encaixadas daqui em diante e tira os dias que já têm sessão', () => {
    const planned = toFitItems(progress, tasks, days({ '2026-10-29': [session('Inglês')], '2026-10-26': [session('Inglês')] }), today)
    const english = planned.find((item) => item.task.taskId === 'Inglês')
    expect(english).toMatchObject({ badge: '×1', detail: '2 h · falta 1 vez' })
    expect(english?.dates).toEqual(['2026-10-28', '2026-10-30', '2026-10-31', '2026-11-01'])

    const full = toFitItems(progress, tasks, days({ '2026-10-29': [session('Inglês')], '2026-10-30': [session('Inglês')] }), today)
    expect(full.map((item) => item.task.taskId)).not.toContain('Inglês')
  })

  it('mostra quando a pontual já tem sessão', () => {
    const planned = toFitItems(progress, tasks, days({ '2026-10-30': [session('Finanças')] }), today)
    expect(planned[0]).toMatchObject({ detail: 'Prazo sáb · encaixada sex' })
    expect(planned[0].dates).not.toContain('2026-10-30')
  })
})
