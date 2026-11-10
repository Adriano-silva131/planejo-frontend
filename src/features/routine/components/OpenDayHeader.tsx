import { ArrowRight, X } from 'lucide-react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { Button } from '@/shared/ui/Button'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { joinClasses } from '@/shared/ui/joinClasses'
import { columnWidthClasses, openDayTitleId } from '../weekColumns'
import type { DayFree } from '../weekSummary'

export type OpenDayHeaderProps = {
  free: DayFree
  isToday: boolean
  // Fim da faixa visível, em horas: o livre de hoje vai até ali.
  endHour: number
  onClose: () => void
}

export function OpenDayHeader({ free, isToday, endHour, onClose }: OpenDayHeaderProps) {
  const date = fromIsoDate(free.date)
  const freeText = free.isEmpty ? 'Dia todo livre' : `${formatDuration(free.freeMinutes)} livres até ${String(endHour).padStart(2, '0')}:00`

  return (
    <div
      className={joinClasses(
        'flex items-start justify-between gap-2 rounded-t-control px-3 py-2',
        columnWidthClasses.open,
        isToday ? 'border-x border-t border-action/50 bg-highlight' : 'bg-surface-alt',
      )}
    >
      <div className="min-w-0">
        <h2 id={openDayTitleId(free.date)} tabIndex={-1} className="flex items-baseline gap-1.5 outline-none">
          <span className={joinClasses('type-meta', isToday ? 'text-action' : 'text-ink-muted')}>{shortWeekdayLabel(date)}</span>
          <span className="type-section tabular-nums">{date.getDate()}</span>
          {isToday && <span className="type-meta text-ink-muted">· hoje</span>}
        </h2>
        <p className="truncate type-meta text-ink-muted">{freeText}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {isToday && (
          <ButtonLink to="/meu-dia" variant="secondary">
            Meu dia
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        )}
        <Button variant="ghost" size="icon" aria-label={`Fechar ${longDateLabel(date)}`} onClick={onClose}>
          <X aria-hidden="true" className="size-5" />
        </Button>
      </div>
    </div>
  )
}
