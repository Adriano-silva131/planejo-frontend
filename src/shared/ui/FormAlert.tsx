import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

export type FormAlertProps = {
  children: ReactNode
}

export function FormAlert({ children }: FormAlertProps) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-control border border-danger p-3 type-meta text-danger">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  )
}
