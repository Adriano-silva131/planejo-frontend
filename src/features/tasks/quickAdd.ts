import type { TaskFields } from './api/taskTypes'

// O mínimo para anotar algo: o quê, quando e a área. Com horário vira compromisso daquele dia; sem, vira prazo.
export type QuickAddValues = {
  title: string
  date: string
  start: string
  end: string
  area: string
}

export type QuickAddKind = 'appointment' | 'deadline'

export type QuickAddProblem = {
  field: keyof QuickAddValues
  message: string
}

export function quickAddKind(values: QuickAddValues): QuickAddKind {
  return values.start || values.end ? 'appointment' : 'deadline'
}

export function quickAddProblem(values: QuickAddValues): QuickAddProblem | undefined {
  if (!values.title.trim()) return { field: 'title', message: 'Diga o que é.' }
  if (!values.date) return { field: 'date', message: 'Escolha o dia.' }
  if (Boolean(values.start) !== Boolean(values.end)) {
    const field = values.start ? 'end' : 'start'
    return { field, message: 'Informe o início e o fim, ou apague os dois para virar prazo.' }
  }
  if (values.start && values.start === values.end) return { field: 'end', message: 'O fim precisa ser diferente do início.' }
  if (!values.area.trim()) return { field: 'area', message: 'Escolha a área.' }
  return undefined
}

// Compromisso é a tarefa fixa num dia só, a mesma do cadastro completo; prazo é a pontual, com prioridade média.
export function toQuickAddPayload(values: QuickAddValues): TaskFields {
  const base = { title: values.title.trim(), area: values.area.trim() }
  if (quickAddKind(values) === 'appointment') {
    return { ...base, kind: 'fixed', date: values.date, start: values.start, end: values.end }
  }
  return { ...base, kind: 'one_off', priority: 'medium', deadline: values.date }
}
