import { Plus, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useQuickAdd } from '@/shared/planning/quickAdd'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { Button } from '@/shared/ui/Button'
import { openDayTitleId } from '../weekColumns'

export type OpenBoardDayHeaderProps = {
  date: string
  isToday: boolean
  // Livre que sobra no dia; ausente num dia que passou.
  room?: number
  viewToggle?: ReactNode
  onClose?: () => void
}

// Ao abrir o dia, o foco vem para o título (useOpenDayFocus).
export function OpenBoardDayHeader({ date, isToday, room, viewToggle, onClose }: OpenBoardDayHeaderProps) {
  const day = fromIsoDate(date)
  const quickAdd = useQuickAdd()
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 id={openDayTitleId(date)} tabIndex={-1} className="type-section text-action outline-none first-letter:uppercase">
          {longDateLabel(day)}
          {isToday && <span className="type-meta text-ink-muted"> · hoje</span>}
        </h2>
        {room !== undefined && (
          <p className="type-meta text-ink-muted">
            {room > 0 ? (
              <>
                Sobram <strong className="text-ink">{formatDuration(room)}</strong> livres
              </>
            ) : (
              'Sem tempo livre'
            )}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {quickAdd && room !== undefined && (
          <Button variant="secondary" onClick={() => quickAdd({ date })}>
            <Plus aria-hidden="true" className="size-4" />
            Adicionar
          </Button>
        )}
        {viewToggle}
        {onClose && (
          <Button variant="ghost" size="icon" aria-label={`Fechar ${longDateLabel(day)}`} onClick={onClose}>
            <X aria-hidden="true" className="size-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
