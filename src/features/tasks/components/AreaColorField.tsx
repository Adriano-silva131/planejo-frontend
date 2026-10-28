import { useId, useMemo } from 'react'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import { fieldLabelClasses, FieldMessages } from '@/shared/ui/FieldMessages'

export type AreaColorFieldProps = {
  area: string
  color: string
  onChange: (color: string) => void
}

const previewId = 'area-color-preview'

export function AreaColorField({ area, color, onChange }: AreaColorFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const preview = useMemo(() => [{ id: previewId, color }], [color])
  useCategoryColors(preview)
  const name = area.trim()

  return (
    <div>
      <label htmlFor={id} className={fieldLabelClasses}>
        Cor da área
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={color}
          aria-describedby={hintId}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-16 shrink-0 cursor-pointer rounded-control border border-line bg-surface p-1 focus-visible:outline-2 focus-visible:outline-accent"
        />
        <span
          data-category={previewId}
          className="min-w-0 truncate rounded-control border-l-4 border-hue-line bg-hue px-3 py-2 type-control text-on-hue"
        >
          {name || 'Prévia'}
        </span>
      </div>
      <FieldMessages
        hintId={hintId}
        hint={name ? `Vale para todas as atividades de ${name}.` : 'Vale para todas as atividades da área.'}
      />
    </div>
  )
}
