import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { PlannedDay } from '@/features/routine/api/routineTypes'
import type { SessionTask } from '@/features/routine/sessionForm'
import type { Task } from '@/features/tasks/api/taskTypes'
import { daysBetween, fromIsoDate } from '@/shared/time/calendarDate'
import { daysLeftLabel, shortWeekdayLabel, weekdayIn } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'

export type ToFitItem = {
  task: SessionTask
  area: string
  detail: string
  badge: string
  urgent: boolean
  // Dias de hoje em diante em que dá para encaixar uma sessão: sem outra sessão da atividade, sem registro de feito
  // e, na pontual no prazo, até o prazo.
  dates: string[]
  // Quanto a sessão ocupa ao ser arrastada para a grade.
  minutes: number
}

const urgentDays = 3
const oneOffMinutes = 60

// O que ainda falta encaixar na semana: recorrentes com menos sessões e registros que a meta, e pontuais abertas.
export function toFitItems(progress: WeekProgress, tasks: Task[], days: PlannedDay[], today: string): ToFitItem[] {
  const byId = new Map(tasks.map((task) => [task.id, task]))
  const ahead = days.filter((day) => day.date >= today)
  const sessionDays = (taskId: string) =>
    ahead.filter((day) => (day.blocks ?? []).some((block) => block.taskId === taskId)).map((day) => day.date)

  const recurring = (progress.recurring ?? []).flatMap((item) => {
    const task = byId.get(item.taskId)
    if (!task) return []
    const done = item.days ?? []
    const placed = sessionDays(task.id).filter((date) => !done.includes(date))
    const left = item.expected - item.done - placed.length
    if (left <= 0) return []
    const minutes = task.durationMinutes ?? 0
    const times = left === 1 ? 'falta 1 vez' : `faltam ${left} vezes`
    return [
      {
        task: { taskId: task.id, title: task.title, kind: 'recurring' as const, durationMinutes: minutes },
        area: task.area,
        detail: `${formatDuration(minutes)} · ${times}`,
        badge: `×${left}`,
        urgent: false,
        dates: openDates(ahead, task.id, done),
        minutes,
      },
    ]
  })
  const oneOff = (progress.oneOff ?? [])
    .filter((item) => !item.completedOn)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .flatMap((item) => {
      const task = byId.get(item.taskId)
      if (!task) return []
      const days = daysBetween(today, item.deadline)
      const next = sessionDays(task.id)[0]
      const placed = next ? ` · encaixada ${weekday(next)}` : ''
      return [
        {
          task: { taskId: task.id, title: task.title, kind: 'one_off' as const },
          area: task.area,
          detail: `Prazo ${weekday(item.deadline)}${placed}`,
          badge: daysLeftLabel(days),
          urgent: days <= urgentDays,
          dates: untilDeadline(openDates(ahead, task.id, []), item.deadline, today),
          minutes: oneOffMinutes,
        },
      ]
    })
  return [...oneOff.filter((item) => item.urgent), ...recurring, ...oneOff.filter((item) => !item.urgent)]
}

function openDates(days: PlannedDay[], taskId: string, done: string[]) {
  return days
    .filter((day) => !done.includes(day.date) && !(day.blocks ?? []).some((block) => block.taskId === taskId))
    .map((day) => day.date)
}

// Pontual só vai até o prazo. Atrasada, segue encaixável nos dias que restam para ainda ser feita.
function untilDeadline(dates: string[], deadline: string, today: string) {
  return deadline < today ? dates : dates.filter((date) => date <= deadline)
}

function weekday(date: string) {
  return shortWeekdayLabel(fromIsoDate(date)).toLowerCase()
}

// Onde o card aparece: no Meu dia, só hoje; na Semana, a semana toda ou o dia aberto na grade.
export type ToFitContext = 'today' | 'week'

export function toFitTitle(context: ToFitContext, day: string | undefined) {
  if (context === 'today') return 'Para encaixar hoje'
  return day ? `Para encaixar ${weekdayIn(fromIsoDate(day))}` : 'Para encaixar'
}

// O que dá para fazer com cada item: escolher o horário (e o dia, se nenhum estiver escolhido) e, em tela larga com a
// grade à vista, arrastar.
export function toFitHint(day: string | undefined, draggable: boolean) {
  const narrow = day ? 'Escolha o horário de cada uma.' : 'Escolha o dia e o horário de cada uma.'
  if (!draggable) return { wide: narrow, narrow }
  return { wide: day ? 'Arraste para o dia aberto ou escolha o horário.' : 'Arraste para a grade ou escolha o dia e o horário.', narrow }
}

// Com um dia escolhido, só o que pode ir para ele, e só para ele.
export function toFitOn(items: ToFitItem[], day: string | undefined) {
  if (!day) return items
  return items.flatMap((item) => (item.dates.includes(day) ? [{ ...item, dates: [day] }] : []))
}
