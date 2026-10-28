import { fieldLabelClasses, FieldMessages } from '@/shared/ui/FieldMessages'
import { FieldRow } from '@/shared/ui/FormLayout'
import { TextField } from '@/shared/ui/TextField'
import type { TaskFieldsProps } from '../types'

export type DurationFieldProps = TaskFieldsProps & {
  legend: string
}

export function DurationField({ form, legend }: DurationFieldProps) {
  const { register, formState } = form
  const error = formState.errors.durationMinutes?.message

  return (
    <fieldset aria-invalid={error ? true : undefined}>
      <legend className={fieldLabelClasses}>{legend}</legend>
      <FieldRow>
        <TextField label="Horas" type="number" min={0} max={100} inputMode="numeric" {...register('durationHours')} />
        <TextField label="Minutos" type="number" min={0} max={59} step={5} inputMode="numeric" {...register('durationMinutes')} />
      </FieldRow>
      <FieldMessages error={error} />
    </fieldset>
  )
}
