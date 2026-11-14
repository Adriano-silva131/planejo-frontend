import { useWeekProgress } from '@/features/progress/api/progressQueries'
import type { PlannedDay } from '@/features/routine/api/routineTypes'
import { useWeekRoutine } from '@/features/routine/api/useWeekRoutine'
import { useTasks } from '@/features/tasks/api/taskQueries'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { addDays } from '@/shared/time/week'
import { toFitItems, toFitOn, type ToFitContext, type ToFitItem } from './toFitItems'

// Itens undefined enquanto carrega ou quando a semana já passou. Na Semana a busca é sempre pela semana mostrada, para
// abrir outro dia só filtrar o que já veio.
export function useToFitItems(context: ToFitContext, day: string | undefined): { items?: ToFitItem[]; hasGrid: boolean } {
  const now = useNow()
  const today = toIsoDate(now)
  const week = useWeekParam(now)
  const weekIso = context === 'today' && day ? day : week.iso
  const progress = useWeekProgress(weekIso)
  const tasks = useTasks(1)
  const routine = useWeekRoutine(weekIso)

  const weekIsOver = context === 'week' && toIsoDate(addDays(week.start, 6)) < today
  if (weekIsOver || !progress.isSuccess || !tasks.isSuccess || !routine.isSuccess) return { hasGrid: false }
  const days = (routine.data.days ?? []) as PlannedDay[]
  const items = toFitItems(progress.data, tasks.data.data ?? [], days, today)
  return { items: toFitOn(items, day), hasGrid: days.some((planned) => (planned.blocks ?? []).length > 0) }
}
