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
        'inline-flex items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <circle cx="12" cy="12" r="9" className="fill-accent" />
        <path d="M18 14a8 8 0 0 1 8 8v6h-6a8 8 0 0 1-8-8 6 6 0 0 1 6-6Z" className="fill-peach" />
      </svg>
      <span className="type-section font-bold tracking-tight text-ink">Planejo</span>
    </Link>
  )
}
