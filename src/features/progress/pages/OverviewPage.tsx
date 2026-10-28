import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { isSameWeek, weekRangeLabel } from '@/shared/time/week'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekNavigator } from '@/shared/ui/WeekNavigator'
import { useHabits } from '../api/progressQueries'
import { HabitsSection } from '../components/HabitsSection'
import { WeekProgressContent } from '../components/WeekProgressContent'

export function OverviewPage() {
  const now = useNow()
  const week = useWeekParam(now)
  const habits = useHabits(week.iso)
  const isCurrentWeek = isSameWeek(week.start, now)

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Visão geral · Planejo</title>
      <PageHeader title="Visão geral" description="Como a semana está indo. Sem cobrança, só para você se situar.">
        <WeekNavigator
          label={weekRangeLabel(week.start)}
          isCurrentWeek={isCurrentWeek}
          onPrevious={week.previous}
          onNext={week.next}
          onToday={week.today}
        />
      </PageHeader>
      <WeekProgressContent week={week.iso} today={toIsoDate(now)} canCheckIn={isCurrentWeek} />
      {habits.isSuccess && (
        <HabitsSection habits={habits.data.habits ?? []} ongoingWeek={isCurrentWeek ? habits.data.weekStart : undefined} />
      )}
    </div>
  )
}
