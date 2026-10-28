import { ApiError } from '@/shared/api/apiError'
import { Button } from './Button'

export type ErrorStateProps = {
  title: string
  error: Error
  onRetry: () => void
}

export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.message : 'Algo saiu do plano por aqui. Tente de novo.'

  return (
    <section role="alert" className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-5 md:p-6">
      <h2 className="type-section">{title}</h2>
      <p className="text-ink-muted">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Tentar de novo
      </Button>
    </section>
  )
}
