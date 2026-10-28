import { ButtonLink } from '@/shared/ui/ButtonLink'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <title>Página não encontrada · Planejo</title>
      <p className="type-eyebrow text-accent">Erro 404</p>
      <h1 className="type-title">Essa página não cabe no plano.</h1>
      <p className="text-ink-muted">O endereço pode ter mudado, ou nunca existiu.</p>
      <ButtonLink to="/">Voltar para o início</ButtonLink>
    </main>
  )
}
