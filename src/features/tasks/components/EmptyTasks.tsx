import { ButtonLink } from '@/shared/ui/ButtonLink'

export function EmptyTasks() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-peach p-5 text-on-peach md:p-6">
      <h2 className="type-section">Nenhuma atividade ainda.</h2>
      <p>Comece pelo que já tem hora marcada, como trabalho ou aula. O resto a gente encaixa em volta.</p>
      <ButtonLink to="/atividades/nova" variant="brand">
        Cadastrar a primeira
      </ButtonLink>
    </section>
  )
}
