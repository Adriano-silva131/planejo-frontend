import { Logo } from '@/shared/ui/Logo'
import { LandingContainer } from './LandingContainer'

const currentYear = new Date().getFullYear()

export function LandingFooter() {
  return (
    <footer className="border-t border-line py-8">
      <LandingContainer className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="type-meta text-ink-muted">© {currentYear} Planejo · planejoai.com</p>
      </LandingContainer>
    </footer>
  )
}
