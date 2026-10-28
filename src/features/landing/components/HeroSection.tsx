import { ButtonLink } from '@/shared/ui/ButtonLink'
import { AppPreview } from './AppPreview'
import { LandingContainer } from './LandingContainer'

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="py-12 md:py-20">
      <LandingContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-6">
          <p className="type-eyebrow text-accent">Planejamento com IA</p>
          <h1 id="hero-title" className="type-display">
            Cabe no dia.
            <br />
            Cabe na vida.
          </h1>
          <p className="max-w-xl text-ink-muted">
            Cadastre o que importa e deixe a IA montar uma rotina que respeita seu tempo, seu descanso e os
            imprevistos.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/entrar" size="lg">
              Começar agora
            </ButtonLink>
            <ButtonLink to="/entrar" variant="secondary" size="lg">
              Já tenho conta
            </ButtonLink>
          </div>
        </div>
        <AppPreview />
      </LandingContainer>
    </section>
  )
}
