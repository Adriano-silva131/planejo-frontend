import { areaKey } from '@/shared/theme/areaColors'
import type { Task } from './api/taskTypes'

export type AreaCount = { key: string; area: string; count: number }

export type TaskFilter = {
  area?: string
  query?: string
}

// Grafias da mesma área ("Saúde", "saude") contam juntas, com o nome da primeira que aparece.
export function areaCounts(tasks: Task[]): AreaCount[] {
  const counts = new Map<string, AreaCount>()
  for (const task of tasks) {
    const key = areaKey(task.area)
    const current = counts.get(key)
    counts.set(key, { key, area: current?.area ?? task.area, count: (current?.count ?? 0) + 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.area.localeCompare(b.area, 'pt-BR'))
}

export function filterTasks(tasks: Task[], { area, query }: TaskFilter) {
  const search = normalize(query ?? '')
  return tasks.filter(
    (task) =>
      (!area || areaKey(task.area) === area) &&
      (!search || normalize(task.title).includes(search) || normalize(task.area).includes(search)),
  )
}

// Só a rotina da semana: fixa num dia só é compromisso e fica com as pontuais.
export function fixedByStart(tasks: Task[]) {
  return tasks
    .filter((task) => task.kind === 'fixed' && !task.date)
    .sort((a, b) => (a.start ?? '').localeCompare(b.start ?? '') || a.title.localeCompare(b.title, 'pt-BR'))
}

export function isAppointment(task: Task) {
  return task.kind === 'fixed' && Boolean(task.date)
}

// Pontuais com prazo e compromissos de hoje em diante, pela data e depois pelo horário.
export function oneOffByDate(tasks: Task[], today: string) {
  return tasks
    .filter((task) => task.kind === 'one_off' || (isAppointment(task) && (task.date ?? '') >= today))
    .sort((a, b) => oneOffDate(a).localeCompare(oneOffDate(b)) || (a.start ?? '').localeCompare(b.start ?? ''))
}

function oneOffDate(task: Task) {
  return task.date ?? task.deadline ?? ''
}

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
