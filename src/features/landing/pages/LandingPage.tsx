import { CallToActionSection } from '../components/CallToActionSection'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { LandingFooter } from '../components/LandingFooter'
import { LandingHeader } from '../components/LandingHeader'
import { PhilosophySection } from '../components/PhilosophySection'

export function LandingPage() {
  return (
    <>
      <title>Planejo · Sua rotina com espaço para a vida</title>
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PhilosophySection />
        <CallToActionSection />
      </main>
      <LandingFooter />
    </>
  )
}
