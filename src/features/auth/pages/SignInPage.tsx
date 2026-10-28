import { Navigate, useLocation } from 'react-router'
import { useSession } from '@/shared/auth/useSession'
import { Logo } from '@/shared/ui/Logo'
import { SignInForm } from '../components/SignInForm'
import { redirectTarget } from '../redirectTarget'

export function SignInPage() {
  const session = useSession()
  const location = useLocation()

  if (session.status === 'signedIn') return <Navigate to={redirectTarget(location.state)} replace />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <title>Entrar · Planejo</title>
      <Logo />
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-5 md:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="type-headline">Que bom te ver.</h1>
          <p className="text-ink-muted">
            Entre com seu e-mail ou com o Google. Se for a primeira vez, a conta é criada na hora.
          </p>
        </div>
        <SignInForm />
      </div>
    </main>
  )
}
