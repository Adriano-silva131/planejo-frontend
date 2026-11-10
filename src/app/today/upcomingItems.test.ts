import { describe, expect, it } from 'vitest'
import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { Task } from '@/features/tasks/api/taskTypes'
import { upcomingItems } from './upcomingItems'

function task(id: string, fields: Partial<Task>): Task {
  return { id, title: id, area: 'Pessoal', kind: 'one_off', createdAt: '', updatedAt: '', ...fields } as Task
}

const tasks = [
  task('Finanças', {}),
  task('Relatório', { area: 'Trabalho' }),
  task('Exame', { kind: 'fixed', date: '2026-10-29', start: '08:30', end: '09:20' }),
  task('Dentista', { kind: 'fixed', date: '2026-10-30', start: '14:00', end: '15:00' }),
  task('Corte', { kind: 'fixed', date: '2026-10-30', start: '10:00', end: '10:40' }),
  task('Viagem', { kind: 'fixed', date: '2026-11-12', start: '07:00', end: '09:00' }),
  task('Almoço', { kind: 'fixed', weekdays: ['monday'], start: '12:00', end: '13:00' }),
]

const progress: WeekProgress = {
  start: '2026-10-26',
  end: '2026-11-01',
  recurring: [],
  oneOff: [
    { taskId: 'Relatório', title: 'Relatório', deadline: '2026-11-17' },
    { taskId: 'Finanças', title: 'Finanças', deadline: '2026-10-31' },
    { taskId: 'Revisão', title: 'Revisão', deadline: '2026-10-29', completedOn: '2026-10-27' },
    { taskId: 'Imposto', title: 'Imposto', deadline: '2026-10-27' },
  ],
}

describe('upcomingItems', () => {
  const items = upcomingItems(progress, tasks, '2026-10-29')

  it('junta pontuais abertas e compromissos dos próximos dias, por data e horário', () => {
    expect(items.map((item) => item.taskId)).toEqual(['Imposto', 'Corte', 'Dentista', 'Finanças', 'Relatório'])
  })

  it('mostra o prazo da pontual, que dá para concluir', () => {
    expect(items[3]).toMatchObject({ when: 'até sáb, 31 out', days: 2, urgent: true, completable: true })
    expect(items[4]).toMatchObject({ days: 19, urgent: false })
    expect(items[0]).toMatchObject({ days: -2, urgent: true })
  })

  it('mostra o dia e o horário do compromisso', () => {
    expect(items[1]).toMatchObject({ when: 'sex, 30 out · 10:00', days: 1, completable: false })
  })
})
