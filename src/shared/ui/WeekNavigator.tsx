import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export type WeekNavigatorProps = {
  label: string
  isCurrentWeek: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

const arrowClasses =
  'flex min-h-11 cursor-pointer items-center px-3 text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent'

export function WeekNavigator({ label, isCurrentWeek, onPrevious, onNext, onToday }: WeekNavigatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center overflow-hidden rounded-control border border-line bg-surface">
        <button type="button" aria-label="Semana anterior" onClick={onPrevious} className={arrowClasses}>
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <span aria-live="polite" className="min-w-32 px-2 text-center type-control tabular-nums">
          {label}
        </span>
        <button type="button" aria-label="Próxima semana" onClick={onNext} className={arrowClasses}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
      <Button variant="secondary" onClick={onToday} disabled={isCurrentWeek}>
        Hoje
      </Button>
    </div>
  )
}
