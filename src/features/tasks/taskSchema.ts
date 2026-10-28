import { z } from 'zod'
import type { TaskKind } from './api/taskTypes'
import { weekdayOrder } from './taskLabels'

export const minDuration = 5
export const maxDuration = 6000

export const taskFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Dê um nome para a atividade.').max(120, 'Use até 120 caracteres.'),
    area: z.string().trim().min(1, 'Escolha ou digite uma área, como Saúde ou Trabalho.').max(50, 'Use até 50 caracteres.'),
    kind: z.enum(['fixed', 'recurring', 'one_off']),
    fixedRepeat: z.enum(['weekdays', 'date']),
    weekdays: z.array(z.enum(weekdayOrder)),
    date: z.string(),
    start: z.string(),
    end: z.string(),
    priority: z.enum(['high', 'medium', 'low', '']),
    durationHours: z.string(),
    durationMinutes: z.string(),
    deadline: z.string(),
    period: z.enum(['morning', 'afternoon', 'evening', '']),
  })
  .superRefine((values, ctx) => {
    const issue = (path: keyof TaskFormValues, message: string) => ctx.addIssue({ code: 'custom', path: [path], message })
    checksByKind[values.kind](values, issue)
  })

export type TaskFormValues = z.infer<typeof taskFormSchema>
type Issue = (path: keyof TaskFormValues, message: string) => void

export const taskFormFields = Object.keys(taskFormSchema.shape) as (keyof TaskFormValues)[]

export const emptyTaskForm: TaskFormValues = {
  title: '',
  area: '',
  kind: 'fixed',
  fixedRepeat: 'weekdays',
  weekdays: [],
  date: '',
  start: '',
  end: '',
  priority: '',
  durationHours: '',
  durationMinutes: '',
  deadline: '',
  period: '',
}

export function totalMinutes(values: Pick<TaskFormValues, 'durationHours' | 'durationMinutes'>) {
  return (Number(values.durationHours) || 0) * 60 + (Number(values.durationMinutes) || 0)
}

const checksByKind: Record<TaskKind, (values: TaskFormValues, issue: Issue) => void> = {
  fixed: checkFixed,
  recurring: (values, issue) => {
    checkPriority(values, issue)
    if (values.weekdays.length === 0) issue('weekdays', 'Escolha ao menos um dia.')
    checkDuration(values, issue)
  },
  one_off: (values, issue) => {
    checkPriority(values, issue)
    checkDuration(values, issue)
    if (!values.deadline) issue('deadline', 'Escolha até quando ela precisa ficar pronta.')
  },
}

function checkFixed(values: TaskFormValues, issue: Issue) {
  if (values.fixedRepeat === 'weekdays' && values.weekdays.length === 0) issue('weekdays', 'Escolha ao menos um dia.')
  if (values.fixedRepeat === 'date' && !values.date) issue('date', 'Escolha o dia.')
  if (!values.start) issue('start', 'Informe o início.')
  if (!values.end) issue('end', 'Informe o fim.')
  if (values.start && values.start === values.end) issue('end', 'O fim precisa ser diferente do início.')
}

function checkPriority(values: TaskFormValues, issue: Issue) {
  if (!values.priority) issue('priority', 'Escolha a prioridade.')
}

function checkDuration(values: TaskFormValues, issue: Issue) {
  const minutes = totalMinutes(values)
  if (minutes < minDuration) issue('durationMinutes', `A duração mínima é de ${minDuration} minutos.`)
  if (minutes > maxDuration) issue('durationMinutes', 'A duração máxima é de 100 horas.')
}
