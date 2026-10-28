import { FieldRow } from '@/shared/ui/FormLayout'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { periodOptions, priorityOptions, weekdayOptions } from '../taskLabels'
import type { TaskFieldsProps } from '../types'
import { DurationField } from './DurationField'

export function RecurringFields({ form }: TaskFieldsProps) {
  const { register, formState } = form

  return (
    <>
      <OptionGroup legend="Prioridade" options={priorityOptions} error={formState.errors.priority?.message} {...register('priority')} />
      <OptionGroup
        legend="Dias"
        multiple
        layout="week"
        options={weekdayOptions}
        error={formState.errors.weekdays?.message}
        {...register('weekdays')}
      />
      <DurationField form={form} legend="Duração de cada vez" />
      <OptionGroup legend="Período preferido" options={periodOptions} {...register('period')} />
    </>
  )
}

export function OneOffFields({ form }: TaskFieldsProps) {
  const { register, formState } = form

  return (
    <>
      <OptionGroup legend="Prioridade" options={priorityOptions} error={formState.errors.priority?.message} {...register('priority')} />
      <DurationField form={form} legend="Tempo total" />
      <FieldRow>
        <TextField label="Prazo" type="date" error={formState.errors.deadline?.message} {...register('deadline')} />
      </FieldRow>
      <OptionGroup legend="Período preferido" options={periodOptions} {...register('period')} />
    </>
  )
}
