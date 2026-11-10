import { ChevronLeft, ChevronRight } from 'lucide-react'

export type WeekStepperProps = {
  label?: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

const partClasses =
  'flex min-h-11 cursor-pointer items-center px-3 text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-action'

// O botão do meio volta para a semana atual; label diz qual semana está aberta.
export function WeekStepper({ label = 'Hoje', onPrevious, onNext, onToday }: WeekStepperProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-control border border-line bg-surface">
      <button type="button" aria-label="Semana anterior" onClick={onPrevious} className={partClasses}>
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        aria-label={label === 'Hoje' ? undefined : `${label}. Voltar para esta semana`}
        onClick={onToday}
        className={`${partClasses} min-w-28 justify-center type-control`}
      >
        {label}
      </button>
      <button type="button" aria-label="Próxima semana" onClick={onNext} className={partClasses}>
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}
