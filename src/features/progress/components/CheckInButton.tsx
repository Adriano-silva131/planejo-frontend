import { Check } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useCheckIn, useUndoCheckIn } from '../api/progressQueries'

export type CheckInButtonProps = {
  taskId: string
  date: string
  done: boolean
}

export function CheckInButton({ taskId, date, done }: CheckInButtonProps) {
  const checkIn = useCheckIn()
  const undo = useUndoCheckIn()
  const pending = checkIn.isPending || undo.isPending
  const error = checkIn.error ?? undo.error

  return (
    <div className="flex flex-col gap-2">
      {done ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 type-control text-accent">
            <Check aria-hidden="true" className="size-4" />
            Feito hoje
          </span>
          <Button variant="ghost" disabled={pending} onClick={() => undo.mutate({ taskId, date })}>
            Desfazer
          </Button>
        </div>
      ) : (
        <Button variant="secondary" className="self-start" disabled={pending} onClick={() => checkIn.mutate({ taskId, date })}>
          <Check aria-hidden="true" className="size-4" />
          Marcar como feito hoje
        </Button>
      )}
      {error && <p role="alert" className="type-meta text-danger">{error.message}</p>}
    </div>
  )
}
