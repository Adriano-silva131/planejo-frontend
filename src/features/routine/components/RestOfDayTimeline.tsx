import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration } from '@/shared/time/timeOfDay'
import type { RoutineBlock } from '../api/routineTypes'
import { blockMinutes } from '../blockTime'

export type RestOfDayTimelineProps = {
  blocks: RoutineBlock[]
  className?: string
}

export function RestOfDayTimeline({ blocks, className }: RestOfDayTimelineProps) {
  return (
    <section aria-labelledby="rest-of-day-title" className={className}>
      <h2 id="rest-of-day-title" className="mb-4 type-section">
        O resto do dia
      </h2>
      {blocks.length === 0 ? (
        <p className="text-ink-muted">Nada mais por hoje. Aproveite o espaço.</p>
      ) : (
        <ol className="flex flex-col">
          {blocks.map((block, index) => (
            <TimelineItem key={`${block.taskId}-${block.start}`} block={block} isLast={index === blocks.length - 1} />
          ))}
        </ol>
      )}
    </section>
  )
}

type TimelineItemProps = {
  block: RoutineBlock
  isLast: boolean
}

function TimelineItem({ block, isLast }: TimelineItemProps) {
  return (
    <li className="flex gap-4">
      <span className="w-12 shrink-0 type-meta tabular-nums text-ink-muted">{block.start}</span>
      <div data-category={areaCategoryId(block.area)} aria-hidden="true" className="flex flex-col items-center">
        <span className="mt-1 size-3 rounded-full bg-hue-line" />
        {!isLast && <span className="w-px flex-1 bg-line" />}
      </div>
      <div className="flex-1 pb-6">
        <p className="type-label">{block.title}</p>
        <p className="type-meta text-ink-muted">
          {block.area} · {formatDuration(blockMinutes(block))}
        </p>
      </div>
    </li>
  )
}
