import { WeekRhythmCard } from '@/features/progress/components/WeekRhythmCard'
import { TodayPage } from '@/features/routine/pages/TodayPage'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { UpcomingCard } from './today/UpcomingCard'
import { ToFitCard } from './week/ToFitCard'

export function TodayRoute() {
  const today = toIsoDate(useNow())
  return (
    <TodayPage
      aside={
        <>
          <ToFitCard context="today" day={today} />
          <UpcomingCard />
          <WeekRhythmCard />
        </>
      }
    />
  )
}
