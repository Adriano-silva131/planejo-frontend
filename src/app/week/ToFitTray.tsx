import { useId, useState } from 'react'
import { SessionDialog } from '@/features/routine/components/SessionDialog'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import { useToFitItems } from './useToFitItems'
import type { ToFitItem } from './toFitItems'

export type ToFitTrayProps = {
  // Só o que dá para encaixar neste dia, no pé do dia aberto.
  day?: string
}

// O que falta encaixar, numa fileira: cada atividade com quantas vezes falta. Acima do quadro vale a semana toda.
export function ToFitTray({ day }: ToFitTrayProps) {
  const { items } = useToFitItems('week', day)
  const titleId = useId()
  if (!items || items.length === 0) return null

  return (
    <section
      aria-labelledby={titleId}
      className={joinClasses('flex flex-wrap items-center gap-x-3 gap-y-2', day && 'border-t border-line pt-4')}
    >
      <h2 id={titleId} className="type-meta font-bold text-ink-muted">
        {day ? 'Encaixar neste dia' : 'Para encaixar'}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <ToFitChip key={item.task.taskId} item={item} />
        ))}
      </ul>
    </section>
  )
}

function ToFitChip({ item }: { item: ToFitItem }) {
  const [placing, setPlacing] = useState(false)
  const canPlace = item.dates.length > 0

  return (
    <li data-category={areaCategoryId(item.area)}>
      <button
        type="button"
        disabled={!canPlace}
        onClick={() => setPlacing(true)}
        title={item.detail}
        className="flex max-w-64 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-2.5 type-meta hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-action disabled:cursor-default"
      >
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
        <span className="truncate font-semibold">{item.task.title}</span>
        <span className={joinClasses('shrink-0 tabular-nums', item.urgent ? 'font-bold text-peach-ink' : 'text-ink-muted')}>{item.badge}</span>
        <span className="sr-only">{`, ${item.detail}${canPlace ? '. Encaixar' : ''}`}</span>
      </button>
      {canPlace && <SessionDialog task={item.task} dates={item.dates} open={placing} onClose={() => setPlacing(false)} />}
    </li>
  )
}
