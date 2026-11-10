import { Link } from 'react-router'
import { joinClasses } from './joinClasses'

export type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Planejo, página inicial"
      className={joinClasses(
        'inline-flex items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <circle cx="12" cy="12" r="9" className="fill-action" />
        <circle cx="21.5" cy="21.5" r="7.5" className="fill-peach" />
      </svg>
      <span className="type-section font-bold tracking-tight text-ink">Planejo</span>
    </Link>
  )
}
