import { Navigate, useSearchParams } from 'react-router'
import { useSession } from '@/shared/auth/useSession'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { Logo } from '@/shared/ui/Logo'

export function AuthCallbackPage() {
  const session = useSession()
  const [params] = useSearchParams()

  if (session.status === 'signedIn') return <Navigate to="/meu-dia" replace />

  const failed = session.status === 'signedOut' || params.has('error')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <title>Entrando · Planejo</title>
      <Logo />
      {failed ? (
        <div role="alert" className="flex flex-col items-center gap-4">
          <h1 className="type-section">Não deu para entrar com o Google.</h1>
          <p className="text-ink-muted">Pode ter sido cancelado ou expirado. Tente de novo.</p>
          <ButtonLink to="/entrar">Voltar para a entrada</ButtonLink>
        </div>
      ) : (
        <p role="status" className="text-ink-muted">
          Entrando…
        </p>
      )}
    </main>
  )
}
