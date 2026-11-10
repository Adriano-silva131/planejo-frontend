import type { WeekProgress } from '@/features/progress/api/progressTypes'
import type { Task } from '@/features/tasks/api/taskTypes'
import { isAppointment } from '@/features/tasks/taskFilters'
import { daysBetween, fromIsoDate } from '@/shared/time/calendarDate'
import { shortWeekdayLabel } from '@/shared/time/dateLabels'
import { shortDateLabel } from '@/shared/time/week'

export type UpcomingItem = {
  taskId: string
  title: string
  when: string
  days: number
  urgent: boolean
  // Só a pontual com prazo se conclui; o compromisso acontece no dia.
  completable: boolean
}

const urgentDays = 3
const appointmentDays = 7

// Pontuais abertas, por mais longe que esteja o prazo, e compromissos dos próximos dias.
// Os compromissos de hoje ficam de fora porque já estão no plano do dia.
export function upcomingItems(progress: WeekProgress, tasks: Task[], today: string): UpcomingItem[] {
  const deadlines = (progress.oneOff ?? [])
    .filter((item) => !item.completedOn)
    .map((item) => ({
      date: item.deadline,
      start: '',
      item: { taskId: item.taskId, title: item.title, when: `até ${dayLabel(item.deadline)}`, completable: true },
    }))
  const appointments = tasks
    .filter((task) => isAppointment(task) && isWithin(today, task.date ?? '', appointmentDays))
    .map((task) => ({
      date: task.date ?? '',
      start: task.start ?? '',
      item: { taskId: task.id, title: task.title, when: `${dayLabel(task.date ?? '')} · ${task.start}`, completable: false },
    }))

  return [...deadlines, ...appointments]
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
    .map(({ date, item }) => {
      const days = daysBetween(today, date)
      return { ...item, days, urgent: days <= urgentDays }
    })
}

// "sáb, 31 out"
function dayLabel(iso: string) {
  const date = fromIsoDate(iso)
  return `${shortWeekdayLabel(date).toLowerCase()}, ${shortDateLabel(date)}`
}

function isWithin(today: string, date: string, days: number) {
  const ahead = daysBetween(today, date)
  return ahead > 0 && ahead <= days
}
