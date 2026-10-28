import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useWeekRoutine } from '../api/useWeekRoutine'
import { TodayHeader } from '../components/TodayHeader'
import { TodayOverview } from '../components/TodayOverview'
import { TodaySkeleton } from '../components/TodaySkeleton'

export function TodayPage() {
  const now = useNow()
  const routine = useWeekRoutine(toIsoDate(now))

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Meu dia · Planejo</title>
      <TodayHeader date={now} />
      {routine.isPending && <TodaySkeleton />}
      {routine.isError && (
        <ErrorState title="Não deu para carregar o seu dia." error={routine.error} onRetry={() => void routine.refetch()} />
      )}
      {routine.isSuccess && <TodayOverview week={routine.data} now={now} />}
    </div>
  )
}
