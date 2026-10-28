import { Button } from './Button'
import { Dialog } from './Dialog'
import { FormAlert } from './FormAlert'
import { FormActions } from './FormLayout'

export type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  pending?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, description, confirmLabel, pending, error, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onCancel}>
      <p className="text-ink-muted">{description}</p>
      {error && <FormAlert>{error}</FormAlert>}
      <FormActions>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={pending}>
          {pending ? 'Aguarde…' : confirmLabel}
        </Button>
      </FormActions>
    </Dialog>
  )
}
