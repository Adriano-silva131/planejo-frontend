import { joinClasses } from '@/shared/ui/joinClasses'
import type { DayView } from '../hooks/useDayView'

export type DayViewToggleProps = {
  view: DayView
  onChange: (view: DayView) => void
}

const options: { view: DayView; label: string }[] = [
  { view: 'periods', label: 'Períodos' },
  { view: 'hours', label: 'Horários' },
]

// O mesmo dia por períodos ou na grade de horários. Ao trocar, o foco vai para o botão escolhido (data-view-toggle).
export function DayViewToggle({ view, onChange }: DayViewToggleProps) {
  return (
    <div role="group" aria-label="Ver o dia" className="flex rounded-control border border-line bg-canvas p-0.5">
      {options.map((option) => (
        <button
          key={option.view}
          type="button"
          data-view-toggle={option.view}
          aria-pressed={view === option.view}
          onClick={() => onChange(option.view)}
          className={joinClasses(
            'min-h-9 cursor-pointer rounded-control px-3 type-meta focus-visible:outline-2 focus-visible:outline-action',
            view === option.view ? 'bg-surface-alt font-bold text-ink' : 'font-semibold text-ink-muted hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
