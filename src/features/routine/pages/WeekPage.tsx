import type { ReactNode } from 'react'
import { ErrorState } from '@/shared/ui/ErrorState'
import { TodaySkeleton } from '../components/TodaySkeleton'
import { WeekContent } from '../components/WeekContent'
import { WeekHeader } from '../components/WeekHeader'
import { useWeekView } from '../hooks/useWeekView'

export type WeekPageProps = {
  aside?: ReactNode
}

export function WeekPage({ aside }: WeekPageProps) {
  const { week, routine, days, free, today, now, totalFree, openDate, openDay, closeDay } = useWeekView()

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Semana · Planejo</title>
      <WeekHeader start={week.start} freeMinutes={totalFree} onPrevious={week.previous} onNext={week.next} onToday={week.today} />
      {routine.isPending && <TodaySkeleton />}
      {routine.isError && (
        <ErrorState title="Não deu para carregar a semana." error={routine.error} onRetry={() => void routine.refetch()} />
      )}
      {routine.isSuccess && (
        <WeekContent
          days={days}
          free={free}
          today={today}
          now={now}
          aside={aside}
          openDay={{ date: openDate, open: openDay, close: closeDay }}
        />
      )}
    </div>
  )
}
