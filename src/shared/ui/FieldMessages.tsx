export const fieldLabelClasses = 'mb-2 block type-label'

export type FieldMessagesProps = {
  hint?: string
  error?: string
  hintId?: string
  errorId?: string
}

export function FieldMessages({ hint, error, hintId, errorId }: FieldMessagesProps) {
  if (!hint && !error) return null

  return (
    <div className="mt-2 flex flex-col gap-1">
      {error && (
        <p id={errorId} className="type-meta text-danger">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="type-meta text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
