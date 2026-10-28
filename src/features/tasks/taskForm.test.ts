import { describe, expect, it } from 'vitest'
import type { Task } from './api/taskTypes'
import { fromTask, toTaskPayload } from './taskPayload'
import { emptyTaskForm, taskFormSchema, type TaskFormValues } from './taskSchema'
import { scheduleSummary, weekdaysLabel } from './taskSummary'

const form = (values: Partial<TaskFormValues>): TaskFormValues => ({ ...emptyTaskForm, title: 'Academia', area: 'Saúde', ...values })
const issues = (values: TaskFormValues) => taskFormSchema.safeParse(values).error?.issues.map((issue) => issue.path[0]) ?? []
const meta = { id: '1', createdAt: '', updatedAt: '' }

describe('taskFormSchema', () => {
  it('pede dias e horários na tarefa fixa', () => {
    expect(issues(form({ kind: 'fixed' }))).toEqual(['weekdays', 'start', 'end'])
    expect(issues(form({ kind: 'fixed', fixedRepeat: 'date' }))).toContain('date')
  })

  it('recusa início igual ao fim', () => {
    expect(issues(form({ kind: 'fixed', weekdays: ['monday'], start: '09:00', end: '09:00' }))).toEqual(['end'])
  })

  it('pede prioridade, dias e duração na recorrente', () => {
    expect(issues(form({ kind: 'recurring' }))).toEqual(['priority', 'weekdays', 'durationMinutes'])
  })

  it('pede prazo na pontual e aceita quando está completa', () => {
    expect(issues(form({ kind: 'one_off', priority: 'high', durationHours: '2' }))).toEqual(['deadline'])
    expect(issues(form({ kind: 'one_off', priority: 'high', durationHours: '2', deadline: '2026-10-30' }))).toEqual([])
  })

  it('exige título e área', () => {
    expect(issues({ ...form({ kind: 'fixed', weekdays: ['monday'], start: '09:00', end: '10:00' }), title: ' ', area: '' })).toEqual([
      'title',
      'area',
    ])
  })
})

describe('toTaskPayload', () => {
  it('manda só os campos da tarefa fixa', () => {
    const values = form({ kind: 'fixed', weekdays: ['monday'], start: '09:00', end: '18:00', priority: 'high', durationHours: '1' })
    expect(toTaskPayload(values)).toEqual({ title: 'Academia', area: 'Saúde', kind: 'fixed', weekdays: ['monday'], start: '09:00', end: '18:00' })
  })

  it('usa a data no lugar dos dias quando a fixa é num dia só', () => {
    const values = form({ kind: 'fixed', fixedRepeat: 'date', weekdays: ['monday'], date: '2026-10-30', start: '09:00', end: '10:00' })
    expect(toTaskPayload(values)).not.toHaveProperty('weekdays')
    expect(toTaskPayload(values)).toHaveProperty('date', '2026-10-30')
  })

  it('soma horas e minutos e omite período vazio', () => {
    const values = form({ kind: 'recurring', priority: 'medium', weekdays: ['monday', 'friday'], durationHours: '1', durationMinutes: '30', start: '09:00' })
    expect(toTaskPayload(values)).toEqual({
      title: 'Academia',
      area: 'Saúde',
      kind: 'recurring',
      priority: 'medium',
      weekdays: ['monday', 'friday'],
      durationMinutes: 90,
    })
  })

  it('volta ao mesmo formulário a partir da tarefa salva', () => {
    const values = form({ kind: 'one_off', priority: 'low', durationHours: '5', durationMinutes: '15', deadline: '2026-10-30', period: 'evening' })
    const task: Task = { ...meta, ...toTaskPayload(values) }
    expect(toTaskPayload(fromTask(task))).toEqual(toTaskPayload(values))
  })
})

describe('scheduleSummary', () => {
  it('descreve cada tipo', () => {
    expect(scheduleSummary({ title: 't', area: 'a', kind: 'fixed', weekdays: ['friday', 'monday', 'wednesday'], start: '09:00', end: '18:00' })).toBe(
      'Seg, Qua e Sex · 09:00–18:00',
    )
    expect(scheduleSummary({ title: 't', area: 'a', kind: 'recurring', weekdays: ['monday'], durationMinutes: 60, period: 'morning' })).toBe(
      'Seg · 1 h · manhã',
    )
    expect(scheduleSummary({ title: 't', area: 'a', kind: 'one_off', durationMinutes: 300, deadline: '2026-10-30' })).toBe(
      'Até 30 out · 5 h no total',
    )
  })

  it('agrupa dias conhecidos', () => {
    expect(weekdaysLabel(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])).toBe('Dias úteis')
    expect(weekdaysLabel(['sunday', 'saturday'])).toBe('Fins de semana')
  })
})
