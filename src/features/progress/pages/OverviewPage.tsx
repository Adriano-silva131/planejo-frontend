import type { ReactNode } from 'react'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ErrorState } from '@/shared/ui/ErrorState'
import { OneOffProgressCard } from '../components/OneOffProgressCard'
import { OverviewHeader } from '../components/OverviewHeader'
import { RhythmTable } from '../components/RhythmTable'
import { useOverview } from '../hooks/useOverview'

export type OverviewPageProps = {
  areaTime?: ReactNode
  dayTime?: ReactNode
}

export function OverviewPage({ areaTime, dayTime }: OverviewPageProps) {
  const view = useOverview()
  const { week, habits } = view

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <title>Visão geral · Planejo</title>
      <OverviewHeader start={week.start} now={view.now} onTrack={view.onTrack} onPrevious={week.previous} onNext={week.next} onToday={week.today} />
      {view.isPending && <div role="status" aria-label="Carregando" className="h-64 rounded-card bg-surface-alt motion-safe:animate-pulse" />}
      {habits.isError && <ErrorState title="Não deu para carregar os ritmos." error={habits.error} onRetry={() => void habits.refetch()} />}
      {view.isEmpty && <EmptyProgress />}
      {view.hasContent && (
        <div className="grid items-start gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col gap-6 xl:col-span-2">
            {view.habitList.length > 0 && (
              <RhythmTable habits={view.habitList} weekStart={week.iso} today={view.today} canCheckIn={view.isCurrentWeek} />
            )}
            {dayTime}
          </div>
          <div className="flex flex-col gap-6">
            {areaTime}
            <OneOffProgressCard items={view.oneOff} today={view.today} canCheckIn={view.isCurrentWeek} />
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyProgress() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-peach p-5 text-on-peach md:p-6">
      <h2 className="type-section">Nada para acompanhar nesta semana.</h2>
      <p>Cadastre atividades recorrentes ou pontuais para ver o progresso aqui. As de horário fixo sempre acontecem.</p>
      <ButtonLink to="/atividades?atividade=nova" variant="brand">
        Cadastrar atividade
      </ButtonLink>
    </section>
  )
}
