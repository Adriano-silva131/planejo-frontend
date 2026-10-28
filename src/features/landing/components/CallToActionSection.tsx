import { ButtonLink } from '@/shared/ui/ButtonLink'
import { LandingContainer } from './LandingContainer'

export function CallToActionSection() {
  return (
    <section aria-labelledby="cta-title" className="py-12 md:py-16">
      <LandingContainer>
        <div className="flex flex-col items-start gap-6 rounded-card bg-peach p-6 text-on-peach md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex flex-col gap-2">
            <h2 id="cta-title" className="type-title">
              O plano mudou? A gente ajusta.
            </h2>
            <p>Comece com o que já está na sua agenda.</p>
          </div>
          <ButtonLink to="/entrar" variant="brand" size="lg">
            Começar
          </ButtonLink>
        </div>
      </LandingContainer>
    </section>
  )
}
