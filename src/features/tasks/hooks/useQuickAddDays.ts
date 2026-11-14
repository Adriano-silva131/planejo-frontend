import { fromIsoDate, toIsoDate } from '@/shared/time/calendarDate'
import { deadlineLabel } from '@/shared/time/dateLabels'
import { useNow } from '@/shared/time/useNow'
import { addDays } from '@/shared/time/week'

// Hoje e amanhã para os atalhos do Adicionar rápido, e como cada dia é dito: "hoje", "amanhã", "sábado, 21 nov".
export type Days = { today: string; tomorrow: string; label: (date: string) => string }

export function useQuickAddDays(): Days {
  const now = useNow()
  const today = toIsoDate(now)
  const tomorrow = toIsoDate(addDays(now, 1))
  const label = (date: string) => (date === today ? 'hoje' : date === tomorrow ? 'amanhã' : deadlineLabel(fromIsoDate(date)))
  return { today, tomorrow, label }
}
