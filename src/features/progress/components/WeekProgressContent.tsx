import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useWeekProgress } from '../api/progressQueries'
import { OneOffSection } from './OneOffSection'
import { RecurringSection } from './RecurringSection'

export type WeekProgressContentProps = {
  week: string
  today: string
  canCheckIn: boolean
}

export function WeekProgressContent({ week, today, canCheckIn }: WeekProgressContentProps) {
  const progress = useWeekProgress(week)

  if (progress.isPending) {
    return <div role="status" aria-label="Carregando" className="h-40 rounded-card bg-ink/10 motion-safe:animate-pulse" />
  }
  if (progress.isError) {
    return <ErrorState title="Não deu para carregar o progresso." error={progress.error} onRetry={() => void progress.refetch()} />
  }

  const recurring = progress.data.recurring ?? []
  const oneOff = progress.data.oneOff ?? []
  if (recurring.length + oneOff.length === 0) return <EmptyProgress />

  return (
    <>
      <RecurringSection items={recurring} today={today} canCheckIn={canCheckIn} />
      <OneOffSection items={oneOff} today={today} canCheckIn={canCheckIn} />
    </>
  )
}

function EmptyProgress() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-peach p-5 text-on-peach md:p-6">
      <h2 className="type-section">Nada para acompanhar nesta semana.</h2>
      <p>Cadastre atividades recorrentes ou pontuais para ver o progresso aqui. As de horário fixo sempre acontecem.</p>
      <ButtonLink to="/atividades/nova" variant="brand">
        Cadastrar atividade
      </ButtonLink>
    </section>
  )
}
