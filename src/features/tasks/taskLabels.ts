import type { Option } from '@/shared/ui/OptionGroup'
import type { Period, Priority, TaskKind, Weekday } from './api/taskTypes'

export const weekdayOrder: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const weekdayShort: Record<Weekday, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
}

export const kindLabels: Record<TaskKind, string> = {
  fixed: 'Horário fixo',
  recurring: 'Recorrente',
  one_off: 'Pontual',
}

export const kindOptions: Option<TaskKind>[] = [
  { value: 'fixed', label: 'Horário fixo', description: 'Tem hora marcada, como trabalho ou aula.' },
  { value: 'recurring', label: 'Recorrente', description: 'Repete na semana, como academia.' },
  { value: 'one_off', label: 'Pontual', description: 'Uma vez, até um prazo.' },
]

export const priorityLabels: Record<Priority, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' }

export const priorityOptions: Option<Priority>[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
]

export const periodLabels: Record<Period, string> = { morning: 'manhã', afternoon: 'tarde', evening: 'noite' }

export const periodOptions: Option<Period | ''>[] = [
  { value: '', label: 'Qualquer hora' },
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
]

export const weekdayOptions: Option<Weekday>[] = weekdayOrder.map((day) => ({ value: day, label: weekdayShort[day] }))
