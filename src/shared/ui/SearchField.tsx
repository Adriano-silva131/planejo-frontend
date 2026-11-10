import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { joinClasses } from './joinClasses'

export type SearchFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
}

export function SearchField({ label, className, ...props }: SearchFieldProps) {
  return (
    <label className={joinClasses('relative flex items-center', className)}>
      <span className="sr-only">{label}</span>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-ink-muted" />
      <input
        type="search"
        placeholder={label}
        className="min-h-11 w-full rounded-control border border-line bg-surface pr-3 pl-9 text-ink placeholder:text-ink-muted focus-visible:border-action focus-visible:outline-2 focus-visible:outline-action"
        {...props}
      />
    </label>
  )
}
