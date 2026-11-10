import { z } from 'zod'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import type { PlannedBlock, PlannedDay } from './api/routineTypes'

// O que a tela de encaixe precisa saber da atividade. Pontual não tem duração; numa sessão já encaixada, a duração
// pode ser desconhecida.
export type SessionTask = {
  taskId: string
  title: string
  kind: 'recurring' | 'one_off'
  durationMinutes?: number
}

// Sessão já encaixada, com horários como a API devolve ("24:00" é meia-noite).
export type PlacedSession = {
  date: string
  start: string
  end: string
}

export function sessionFormSchema(kind: SessionTask['kind']) {
  return z
    .object({
      date: z.string({ error: 'Escolha o dia.' }).min(1, 'Escolha o dia.'),
      start: z.string().min(1, 'Informe o início.'),
      end: z.string(),
    })
    .superRefine((values, ctx) => {
      if (kind === 'one_off' && !values.end) ctx.addIssue({ code: 'custom', path: ['end'], message: 'Informe até quando.' })
      if (values.end && values.end === values.start) {
        ctx.addIssue({ code: 'custom', path: ['end'], message: 'O fim precisa ser diferente do início.' })
      }
    })
}

export type SessionFormValues = z.infer<ReturnType<typeof sessionFormSchema>>

export function sessionDefaults(dates: string[], current?: PlacedSession): SessionFormValues {
  if (!current) return { date: dates[0] ?? '', start: '', end: '' }
  const end = current.end === timeOfDayLabel(minutesInDay) ? '00:00' : current.end
  return { date: current.date, start: current.start, end }
}

// A sessão que o bloco mostra; bloco de tarefa fixa não é sessão.
export function blockSession(block: PlannedBlock, date: string): { task: SessionTask; current: PlacedSession } | undefined {
  if (block.taskKind === 'fixed') return undefined
  return {
    task: { taskId: block.taskId, title: block.title, kind: block.taskKind },
    current: { date, start: block.start, end: block.end },
  }
}

// Dias para onde a sessão pode ir: o dela e os de hoje em diante sem outra sessão da mesma atividade.
export function movableDates(days: PlannedDay[], taskId: string, date: string, today: string) {
  return days
    .filter((day) => day.date === date || (day.date >= today && !(day.blocks ?? []).some((block) => block.taskId === taskId)))
    .map((day) => day.date)
}
