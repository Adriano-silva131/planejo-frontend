import { ButtonLink } from '@/shared/ui/ButtonLink'
import { PageHeader } from '@/shared/ui/PageHeader'

export type ComingSoonPageProps = {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <title>{`${title} · Planejo`}</title>
      <PageHeader title={title} />
      <section className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-5 md:p-6">
        <h2 className="type-section">Essa parte ainda está sendo planejada.</h2>
        <p className="text-ink-muted">Enquanto isso, o Meu dia já mostra a sua rotina de hoje.</p>
        <ButtonLink to="/meu-dia" variant="secondary">
          Ir para o Meu dia
        </ButtonLink>
      </section>
    </div>
  )
}
