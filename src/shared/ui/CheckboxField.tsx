import type { ComponentProps } from 'react'

export type CheckboxFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
}

export function CheckboxField({ label, ...props }: CheckboxFieldProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <input type="checkbox" className="size-5 accent-action" {...props} />
      <span>{label}</span>
    </label>
  )
}
