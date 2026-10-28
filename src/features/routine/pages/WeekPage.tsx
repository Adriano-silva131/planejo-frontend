import { Plus } from 'lucide-react'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { isSameWeek, weekRangeLabel } from '@/shared/time/week'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekNavigator } from '@/shared/ui/WeekNavigator'
import { useWeekRoutine } from '../api/useWeekRoutine'
import { TodaySkeleton } from '../components/TodaySkeleton'
import { WeekContent } from '../components/WeekContent'

export function WeekPage() {
  const now = useNow()
  const week = useWeekParam(now)
  const routine = useWeekRoutine(week.iso)

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Semana · Planejo</title>
      <PageHeader
        title="Uma semana que cabe."
        description="Planeje o essencial. Deixe espaço para a vida."
        actions={
          <ButtonLink to="/atividades/nova" aria-label="Nova atividade">
            <Plus aria-hidden="true" className="size-5" />
            <span className="hidden md:inline">Atividade</span>
          </ButtonLink>
        }
      >
        <WeekNavigator
          label={weekRangeLabel(week.start)}
          isCurrentWeek={isSameWeek(week.start, now)}
          onPrevious={week.previous}
          onNext={week.next}
          onToday={week.today}
        />
      </PageHeader>
      {routine.isPending && <TodaySkeleton />}
      {routine.isError && (
        <ErrorState title="Não deu para carregar a semana." error={routine.error} onRetry={() => void routine.refetch()} />
      )}
      {routine.isSuccess && <WeekContent week={routine.data} now={now} />}
    </div>
  )
}
