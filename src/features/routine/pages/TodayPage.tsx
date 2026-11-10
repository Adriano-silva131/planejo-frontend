import type { ReactNode } from 'react'
import { ErrorState } from '@/shared/ui/ErrorState'
import { TodayContent } from '../components/TodayContent'
import { TodayHeader } from '../components/TodayHeader'
import { TodaySkeleton } from '../components/TodaySkeleton'
import { useToday } from '../hooks/useToday'

export type TodayPageProps = {
  aside?: ReactNode
}

export function TodayPage({ aside }: TodayPageProps) {
  const { now, routine, day, week, freeMinutes } = useToday()

  return (
    <div className="flex flex-col gap-6">
      <title>Meu dia · Planejo</title>
      <TodayHeader now={now} freeMinutes={freeMinutes} />
      {routine.isPending && <TodaySkeleton />}
      {routine.isError && (
        <ErrorState title="Não deu para carregar o seu dia." error={routine.error} onRetry={() => void routine.refetch()} />
      )}
      {routine.isSuccess && <TodayContent day={day} week={week} now={now} aside={aside} />}
    </div>
  )
}
