import { useWeekProgress } from '@/features/progress/api/progressQueries'
import { weekScore } from '@/features/progress/weekScore'
import { WeekPage } from '@/features/routine/pages/WeekPage'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useDayParam } from '@/shared/time/useDayParam'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { ToFitCard } from './week/ToFitCard'
import { ToFitTray } from './week/ToFitTray'

// O placar e o que falta encaixar vêm do progresso; o dia aberto, lido da mesma URL que a Semana usa, filtra o que
// dá para encaixar nele.
export function WeekRoute() {
  const now = useNow()
  const week = useWeekParam(now)
  const openDate = useDayParam(week.start).date
  const progress = useWeekProgress(week.iso)
  const upcoming = week.iso > toIsoDate(now)

  return (
    <WeekPage
      score={progress.data && { ...weekScore(progress.data), upcoming }}
      tray={<ToFitTray />}
      dayTray={openDate && <ToFitTray day={openDate} />}
      dayAside={<ToFitCard context="week" day={openDate} />}
    />
  )
}
