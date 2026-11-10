import { AlertCircle, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

export type FormAlertProps = {
  children: ReactNode
  // Com onDismiss, o alerta ganha um botão para fechar.
  onDismiss?: () => void
}

export function FormAlert({ children, onDismiss }: FormAlertProps) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-control border border-danger p-3 type-meta text-danger">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{children}</p>
      {onDismiss && (
        <Button variant="ghost" size="icon" aria-label="Fechar aviso" onClick={onDismiss} className="-my-2 -mr-2">
          <X aria-hidden="true" className="size-4" />
        </Button>
      )}
    </div>
  )
}
