import { describe, expect, it } from 'vitest'
import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { RoutineBlock, PlannedDay } from '@/features/routine/api/routineTypes'
import type { Task } from '@/features/tasks/api/taskTypes'
import { areaTimes, dayTimes, type WeekTimeInput } from './weekTime'

function block(area: string, start: string, end: string, session?: { taskId: string; taskKind: RoutineBlock['taskKind'] }): RoutineBlock {
  const { taskId, taskKind } = session ?? { taskId: area, taskKind: 'fixed' }
  return { taskId, title: area, area, taskKind, start, end, adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
}

function task(id: string, area: string, kind: Task['kind'], extra: Partial<Task> = {}): Task {
  return { id, title: id, area, kind, createdAt: '', updatedAt: '', ...extra } as Task
}

const days: PlannedDay[] = [
  { date: '2026-10-26', weekday: 'monday', blocks: [block('Alimentação', '12:00', '13:00')] },
  {
    date: '2026-10-27',
    weekday: 'tuesday',
    blocks: [
      block('Estudos', '07:00', '09:00', { taskId: 'Inglês', taskKind: 'recurring' }),
      block('Trabalho', '14:00', '16:00', { taskId: 'Relatório', taskKind: 'one_off' }),
    ],
  },
  { date: '2026-10-28', weekday: 'wednesday', blocks: [block('Alimentação', '12:00', '13:00'), block('Estudos', '19:00', '20:00')] },
  { date: '2026-10-29', weekday: 'thursday', blocks: [block('Estudos', '19:00', '20:00')] },
]

const tasks = [
  task('Inglês', 'Estudos', 'recurring', { durationMinutes: 120, weekdays: ['monday', 'wednesday'] }),
  task('Relatório', 'Trabalho', 'one_off', { deadline: '2026-11-17' }),
  task('Leitura', 'Pessoal', 'recurring', { durationMinutes: 45, weekdays: ['saturday'] }),
]

const progress: WeekProgress = {
  start: '2026-10-26',
  end: '2026-11-01',
  recurring: [
    { taskId: 'Inglês', title: 'Inglês', done: 2, expected: 2, days: ['2026-10-26', '2026-10-27'] },
    { taskId: 'Leitura', title: 'Leitura', done: 0, expected: 1, days: [] },
  ],
  oneOff: [{ taskId: 'Relatório', title: 'Relatório', deadline: '2026-11-17', completedOn: '2026-10-27' }],
}

const input: WeekTimeInput = { days, progress, tasks, today: '2026-10-28', now: 12 * 60 + 30 }

describe('dayTimes', () => {
  it('soma fixas que passaram e recorrentes registradas no dia, sem contar a sessão duas vezes', () => {
    expect(dayTimes(input)).toEqual([
      { date: '2026-10-26', done: 60 + 120, planned: 60 + 120 },
      { date: '2026-10-27', done: 120, planned: 120 + 120 },
      { date: '2026-10-28', done: 30, planned: 120 },
      { date: '2026-10-29', done: 0, planned: 60 },
    ])
  })
})

describe('areaTimes', () => {
  it('soma por área e mantém as áreas da semana sem nada feito', () => {
    expect(areaTimes(input)).toEqual([
      { area: 'Estudos', minutes: 240 },
      { area: 'Alimentação', minutes: 90 },
      { area: 'Pessoal', minutes: 0 },
    ])
  })
})
