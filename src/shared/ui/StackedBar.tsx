import { joinClasses } from './joinClasses'
import { stackedSpans } from './stackedSpans'

export type StackedSegment = {
  key: string
  value: number
  category: string
}

export type StackedBarProps = {
  segments: StackedSegment[]
  label: string
}

const columns = 48

// Cada segmento usa a cor da área marcada em data-category.
export function StackedBar({ segments, label }: StackedBarProps) {
  const spans = stackedSpans(
    segments.map((segment) => segment.value),
    columns,
  )

  return (
    <div role="img" aria-label={label} className={joinClasses('grid h-2 gap-0.5', `grid-cols-${columns}`)}>
      {segments.map((segment, index) =>
        spans[index] > 0 ? (
          <span key={segment.key} data-category={segment.category} className={joinClasses('rounded-full bg-hue-line', `col-span-${spans[index]}`)} />
        ) : null,
      )}
    </div>
  )
}
