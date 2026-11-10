import { describe, expect, it } from 'vitest'
import type { Task } from './api/taskTypes'
import { fromTask, toTaskPayload } from './taskPayload'
import { emptyTaskForm, taskFormSchema, type TaskFormValues } from './taskSchema'
import { weekdaysLabel } from './taskSummary'

const form = (values: Partial<TaskFormValues>): TaskFormValues => ({ ...emptyTaskForm, title: 'Academia', area: 'Saúde', ...values })
const issues = (values: TaskFormValues) => taskFormSchema.safeParse(values).error?.issues.map((issue) => issue.path[0]) ?? []
const meta = { id: '1', createdAt: '', updatedAt: '' }

describe('taskFormSchema', () => {
  it('pede dias e horários na tarefa fixa', () => {
    expect(issues(form({ kind: 'fixed' }))).toEqual(['weekdays', 'start', 'end'])
  })

  it('pede dia e horários no compromisso, sem prioridade nem prazo', () => {
    expect(issues(form({ kind: 'one_off', oneOffMode: 'appointment' }))).toEqual(['date', 'start', 'end'])
    expect(issues(form({ kind: 'one_off', oneOffMode: 'appointment', date: '2026-10-29', start: '08:30', end: '09:20' }))).toEqual([])
  })

  it('recusa início igual ao fim', () => {
    expect(issues(form({ kind: 'fixed', weekdays: ['monday'], start: '09:00', end: '09:00' }))).toEqual(['end'])
  })

  it('pede prioridade, vezes por semana e duração na recorrente, sem exigir dias', () => {
    expect(issues(form({ kind: 'recurring' }))).toEqual(['priority', 'timesPerWeek', 'durationMinutes'])
    expect(issues(form({ kind: 'recurring', priority: 'low', timesPerWeek: '3', durationHours: '1' }))).toEqual([])
  })

  it('trata rádio sem opção marcada como campo vazio', () => {
    expect(issues(form({ kind: 'recurring', priority: null, timesPerWeek: null, durationHours: '1' }))).toEqual(['priority', 'timesPerWeek'])
  })

  it('pede prazo na pontual, sem duração', () => {
    expect(issues(form({ kind: 'one_off', priority: 'high' }))).toEqual(['deadline'])
    expect(issues(form({ kind: 'one_off', priority: 'high', deadline: '2026-10-30' }))).toEqual([])
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

  it('manda o compromisso como fixa num dia só e volta como pontual', () => {
    const values = form({ kind: 'one_off', oneOffMode: 'appointment', priority: 'low', date: '2026-10-30', start: '09:00', end: '10:00' })
    expect(toTaskPayload(values)).toEqual({ title: 'Academia', area: 'Saúde', kind: 'fixed', date: '2026-10-30', start: '09:00', end: '10:00' })
    expect(fromTask({ ...meta, ...toTaskPayload(values) })).toMatchObject({ kind: 'one_off', oneOffMode: 'appointment', date: '2026-10-30' })
  })

  it('ignora o modo compromisso que sobrou ao trocar a pontual por recorrente', () => {
    const values = form({ kind: 'recurring', oneOffMode: 'appointment', priority: 'low', timesPerWeek: '3', durationHours: '1', start: '09:00', end: '10:00' })
    expect(toTaskPayload(values)).toMatchObject({ kind: 'recurring', timesPerWeek: 3, durationMinutes: 60 })
    expect(toTaskPayload(values)).not.toHaveProperty('date')
  })

  it('soma horas e minutos e omite período vazio', () => {
    const values = form({
      kind: 'recurring',
      priority: 'medium',
      timesPerWeek: '2',
      weekdays: ['monday', 'friday'],
      durationHours: '1',
      durationMinutes: '30',
      start: '09:00',
    })
    expect(toTaskPayload(values)).toEqual({
      title: 'Academia',
      area: 'Saúde',
      kind: 'recurring',
      priority: 'medium',
      timesPerWeek: 2,
      weekdays: ['monday', 'friday'],
      durationMinutes: 90,
    })
  })

  it('manda vezes por semana só na recorrente e omite dias de costume vazios', () => {
    const recurring = form({ kind: 'recurring', priority: 'low', timesPerWeek: '3', durationHours: '1' })
    expect(toTaskPayload(recurring)).toHaveProperty('timesPerWeek', 3)
    expect(toTaskPayload(recurring)).not.toHaveProperty('weekdays')
    expect(toTaskPayload(fromTask({ ...meta, ...toTaskPayload(recurring) }))).toEqual(toTaskPayload(recurring))
    expect(toTaskPayload({ ...recurring, kind: 'one_off', deadline: '2026-10-30' })).not.toHaveProperty('timesPerWeek')
  })

  it('não manda duração na pontual', () => {
    const values = form({ kind: 'one_off', priority: 'low', durationHours: '5', deadline: '2026-10-30' })
    expect(toTaskPayload(values)).not.toHaveProperty('durationMinutes')
  })

  it('volta ao mesmo formulário a partir da tarefa salva', () => {
    const values = form({ kind: 'one_off', priority: 'low', deadline: '2026-10-30', period: 'evening' })
    const task: Task = { ...meta, ...toTaskPayload(values) }
    expect(toTaskPayload(fromTask(task))).toEqual(toTaskPayload(values))
  })
})

describe('weekdaysLabel', () => {
  it('agrupa dias conhecidos', () => {
    expect(weekdaysLabel(['friday', 'monday', 'wednesday'])).toBe('Seg, Qua e Sex')
    expect(weekdaysLabel(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])).toBe('Dias úteis')
    expect(weekdaysLabel(['sunday', 'saturday'])).toBe('Fins de semana')
  })
})
