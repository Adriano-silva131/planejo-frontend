import { Button } from '@/shared/ui/Button'

export type EmptyTasksProps = {
  onNew: () => void
}

export function EmptyTasks({ onNew }: EmptyTasksProps) {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-peach p-5 text-on-peach md:p-6">
      <h2 className="type-section">Nenhuma atividade ainda.</h2>
      <p>Comece pelo que já tem hora marcada, como trabalho ou aula. O resto a gente encaixa em volta.</p>
      <Button variant="brand" onClick={onNew}>
        Cadastrar a primeira
      </Button>
    </section>
  )
}
