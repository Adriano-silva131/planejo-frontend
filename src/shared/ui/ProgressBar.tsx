import { joinClasses } from './joinClasses'

export type ProgressBarTone = 'action' | 'category'

export type ProgressBarProps = {
  value: number
  max: number
  label: string
  tone?: ProgressBarTone
}

// category usa a cor da área do elemento com data-category mais próximo.
const toneClasses = {
  action: 'bg-action',
  category: 'bg-hue-line',
} satisfies Record<ProgressBarTone, string>

const steps = 24

// Barra contínua feita de passos discretos: a largura vem de classes fixas, não de estilo calculado.
export function ProgressBar({ value, max, label, tone = 'action' }: ProgressBarProps) {
  const filled = max > 0 ? Math.round((Math.min(value, max) / max) * steps) : 0

  return (
    <div role="img" aria-label={label} className="flex h-1 overflow-hidden rounded-full bg-line">
      {Array.from({ length: steps }, (_, index) => (
        <span key={index} className={joinClasses('flex-1', index < filled && toneClasses[tone])} />
      ))}
    </div>
  )
}
