import { useSession } from '@/shared/auth/useSession'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { buttonClasses } from '@/shared/ui/buttonClasses'
import { Logo } from '@/shared/ui/Logo'
import { LandingContainer } from './LandingContainer'

export function LandingHeader() {
  const session = useSession()

  return (
    <header className="border-b border-line">
      <LandingContainer className="flex min-h-18 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:block">
            <a href="#como-funciona" className={buttonClasses({ variant: 'ghost' })}>
              Como funciona
            </a>
          </div>
          {session.status === 'signedIn' ? (
            <ButtonLink to="/meu-dia">Abrir o app</ButtonLink>
          ) : (
            <>
              <ButtonLink to="/entrar" variant="ghost">
                Entrar
              </ButtonLink>
              <ButtonLink to="/entrar">Começar</ButtonLink>
            </>
          )}
        </nav>
      </LandingContainer>
    </header>
  )
}
