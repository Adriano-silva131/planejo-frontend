import type { ComponentProps } from 'react'
import { fieldLabelClasses, FieldMessages } from './FieldMessages'
import { joinClasses } from './joinClasses'

export type Option<T extends string> = {
  value: T
  label: string
  description?: string
}

export type OptionGroupProps<T extends string> = Omit<ComponentProps<'input'>, 'type' | 'value'> & {
  legend: string
  options: readonly Option<T>[]
  multiple?: boolean
  layout?: 'wrap' | 'stack' | 'week'
  hint?: string
  error?: string
}

const layoutClasses = {
  wrap: 'flex flex-wrap',
  stack: 'flex flex-col',
  week: 'grid max-w-md grid-cols-7',
}

const optionClasses =
  'flex min-h-11 flex-col justify-center rounded-control border border-line bg-surface py-2 text-ink peer-checked:border-action peer-checked:bg-action peer-checked:text-on-action peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent'

export function OptionGroup<T extends string>({
  legend,
  options,
  multiple,
  layout = 'wrap',
  hint,
  error,
  ...inputProps
}: OptionGroupProps<T>) {
  return (
    <fieldset aria-invalid={error ? true : undefined}>
      <legend className={fieldLabelClasses}>{legend}</legend>
      <div className={joinClasses('gap-2', layoutClasses[layout])}>
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input type={multiple ? 'checkbox' : 'radio'} value={option.value} className="peer sr-only" {...inputProps} />
            <span className={joinClasses(optionClasses, layout === 'week' ? 'items-center px-1' : 'px-4')}>
              <span className="type-control">{option.label}</span>
              {option.description && <span className="type-meta opacity-80">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldMessages hint={hint} error={error} />
    </fieldset>
  )
}
