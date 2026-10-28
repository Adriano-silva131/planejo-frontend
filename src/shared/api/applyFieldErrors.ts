import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from './apiError'

// Devolve a mensagem que sobra para um alerta geral, quando nenhum campo do formulário casa com o erro.
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldNames: readonly Path<T>[],
): string | undefined {
  if (!(error instanceof ApiError)) return 'Algo saiu do plano por aqui. Tente de novo.'
  let applied = false
  for (const [name, messages] of Object.entries(error.fields)) {
    const field = fieldNames.find((candidate) => candidate === name)
    if (field && messages.length > 0) {
      setError(field, { message: messages.join(' ') })
      applied = true
    }
  }
  return applied ? undefined : error.message
}
