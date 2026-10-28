import { joinClasses } from './joinClasses'

export type SegmentMeterProps = {
  filled: number
  total: number
  label: string
}

export function SegmentMeter({ filled, total, label }: SegmentMeterProps) {
  return (
    <div role="img" aria-label={label} className="flex gap-1">
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={joinClasses('h-2 flex-1 rounded-full', index < filled ? 'bg-accent' : 'bg-ink/10')} />
      ))}
    </div>
  )
}
