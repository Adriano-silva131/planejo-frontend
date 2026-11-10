import { describe, expect, it } from 'vitest'
import type { Task } from './api/taskTypes'
import { areaCounts, filterTasks, fixedByStart, oneOffByDate } from './taskFilters'

function task(title: string, area: string, extra: Partial<Task> = {}): Task {
  return { id: title, title, area, kind: 'recurring', createdAt: '', updatedAt: '', ...extra } as Task
}

const tasks = [
  task('Inglês', 'Estudos'),
  task('Academia', 'Saúde'),
  task('Corrida', 'saude'),
  task('Faculdade', 'Estudos', { kind: 'fixed', start: '19:00' }),
  task('Almoço', 'Alimentação', { kind: 'fixed', start: '12:00' }),
  task('Relatório', 'Trabalho', { kind: 'one_off', deadline: '2026-11-17' }),
  task('Finanças', 'Pessoal', { kind: 'one_off', deadline: '2026-10-31' }),
  task('Exame', 'Trabalho', { kind: 'fixed', date: '2026-10-31', start: '08:30' }),
  task('Corte', 'Beleza', { kind: 'fixed', date: '2026-10-28', start: '10:00' }),
]

describe('areaCounts', () => {
  it('junta grafias da mesma área e ordena pela quantidade', () => {
    expect(areaCounts(tasks).slice(0, 2)).toEqual([
      { key: 'estudos', area: 'Estudos', count: 2 },
      { key: 'saude', area: 'Saúde', count: 2 },
    ])
  })
})

describe('filterTasks', () => {
  it('filtra pela área normalizada', () => {
    expect(filterTasks(tasks, { area: 'saude' }).map((item) => item.title)).toEqual(['Academia', 'Corrida'])
  })

  it('busca no nome e na área, sem acento nem caixa', () => {
    expect(filterTasks(tasks, { query: 'INGLES' }).map((item) => item.title)).toEqual(['Inglês'])
    expect(filterTasks(tasks, { query: 'alimentacao' }).map((item) => item.title)).toEqual(['Almoço'])
  })
})

describe('ordem dos cards', () => {
  it('fixas pelo horário e pontuais pelo prazo', () => {
    expect(fixedByStart(tasks).map((item) => item.title)).toEqual(['Almoço', 'Faculdade'])
    expect(oneOffByDate(tasks, '2026-10-29').map((item) => item.title)).toEqual(['Finanças', 'Exame', 'Relatório'])
  })
})
