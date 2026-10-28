import { Lock } from 'lucide-react'
import { areaCategoryId } from '@/shared/theme/areaColors'

export type AreaLegendProps = {
  areas: string[]
}

export function AreaLegend({ areas }: AreaLegendProps) {
  return (
    <ul aria-label="Legenda" className="flex flex-wrap gap-x-5 gap-y-2 type-meta text-ink-muted">
      {areas.map((area) => (
        <li key={area} data-category={areaCategoryId(area)} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-hue-line" />
          {area}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <Lock aria-hidden="true" className="size-3.5" />
        Horário fixo
      </li>
    </ul>
  )
}
