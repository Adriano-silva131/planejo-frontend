import { useId, type ComponentProps } from 'react'
import { fieldLabelClasses, FieldMessages } from './FieldMessages'
import { joinClasses } from './joinClasses'

export type TextFieldProps = ComponentProps<'input'> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, className, ...props }: TextFieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelClasses}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={joinClasses(
          'min-h-12 w-full rounded-control border bg-surface px-4 text-ink placeholder:text-ink-muted',
          'focus-visible:outline-2 focus-visible:outline-accent',
          error ? 'border-danger' : 'border-line focus-visible:border-accent',
        )}
        {...props}
      />
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  )
}
