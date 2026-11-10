import { Check } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useCheckIn, useUndoCheckIn } from '../api/progressQueries'

export type CheckInToggleProps = {
  taskId: string
  date: string
  done: boolean
}

export function CheckInToggle({ taskId, date, done }: CheckInToggleProps) {
  const checkIn = useCheckIn()
  const undo = useUndoCheckIn()
  const pending = checkIn.isPending || undo.isPending
  const error = checkIn.error ?? undo.error

  return (
    <div className="flex flex-col items-end gap-1">
      {done ? (
        <Button variant="ghost" aria-label="Feito hoje. Desfazer" disabled={pending} onClick={() => undo.mutate({ taskId, date })} className="text-action">
          <Check aria-hidden="true" className="size-4" />
          Feito hoje
        </Button>
      ) : (
        <Button variant="secondary" disabled={pending} onClick={() => checkIn.mutate({ taskId, date })}>
          Feito hoje
        </Button>
      )}
      {error && (
        <p role="alert" className="type-meta text-danger">
          {error.message}
        </p>
      )}
    </div>
  )
}
