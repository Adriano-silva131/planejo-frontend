import { LandingContainer } from './LandingContainer'

export function PhilosophySection() {
  return (
    <section aria-labelledby="philosophy-title" className="py-6 md:py-8">
      <LandingContainer>
        <div className="grid gap-6 rounded-card bg-brand p-6 text-on-brand md:grid-cols-2 md:items-center md:p-10">
          <h2 id="philosophy-title" className="type-display">
            Quando der, deu.
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Nem todo dia rende igual, e tudo bem. No Planejo, descanso e espaço livre fazem parte do plano, não
              sobram dele.
            </p>
            <p>Organize o que importa no tempo que você tem.</p>
          </div>
        </div>
      </LandingContainer>
    </section>
  )
}
