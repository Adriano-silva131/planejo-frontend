import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { AreaCount } from '../taskFilters'

export type AreaFilterChipsProps = {
  areas: AreaCount[]
  selected?: string
  onSelect: (area?: string) => void
}

const chipClasses =
  'flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-3 type-meta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action'

export function AreaFilterChips({ areas, selected, onSelect }: AreaFilterChipsProps) {
  return (
    <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!selected} onClick={() => onSelect(undefined)} className={joinClasses(chipClasses, chipState(!selected))}>
        Todas
      </button>
      {areas.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={selected === item.key}
          onClick={() => onSelect(selected === item.key ? undefined : item.key)}
          data-category={areaCategoryId(item.area)}
          className={joinClasses(chipClasses, chipState(selected === item.key))}
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-hue-line" />
          {item.area} · {item.count}
        </button>
      ))}
    </div>
  )
}

function chipState(active: boolean) {
  return active ? 'border-ink bg-ink font-bold text-canvas' : 'border-line text-ink hover:bg-surface-alt'
}
