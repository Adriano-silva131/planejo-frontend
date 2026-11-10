import { WeekPage } from '@/features/routine/pages/WeekPage'
import { useDayParam } from '@/shared/time/useDayParam'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { ToFitCard } from './week/ToFitCard'

// O card lateral acompanha o dia aberto na grade, lido da mesma URL que a Semana usa.
export function WeekRoute() {
  const week = useWeekParam(useNow())
  const openDate = useDayParam(week.start).date
  return <WeekPage aside={<ToFitCard context="week" day={openDate} />} />
}
