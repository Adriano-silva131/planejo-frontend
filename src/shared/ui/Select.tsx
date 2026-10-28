import { useId, type ComponentProps } from 'react'
import { fieldLabelClasses, FieldMessages } from './FieldMessages'
import { joinClasses } from './joinClasses'

export type SelectProps = ComponentProps<'select'> & {
  label: string
  hint?: string
  error?: string
}

export function Select({ label, hint, error, className, children, ...props }: SelectProps) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelClasses}>
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={joinClasses(
          'min-h-12 w-full rounded-control border bg-surface px-4 text-ink focus-visible:outline-2 focus-visible:outline-accent',
          error ? 'border-danger' : 'border-line',
        )}
        {...props}
      >
        {children}
      </select>
      <FieldMessages hint={hint} error={error} />
    </div>
  )
}
