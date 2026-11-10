import { FieldRow } from '@/shared/ui/FormLayout'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { weekdayOptions } from '../taskLabels'
import type { TaskFieldsProps } from '../types'

export function FixedFields({ form }: TaskFieldsProps) {
  const { register, formState } = form

  return (
    <>
      <OptionGroup legend="Dias" multiple layout="week" options={weekdayOptions} error={formState.errors.weekdays?.message} {...register('weekdays')} />
      <TimeRangeFields form={form} />
    </>
  )
}

export function TimeRangeFields({ form }: TaskFieldsProps) {
  const { register, formState, watch } = form
  const [start, end] = watch(['start', 'end'])
  const { errors } = formState

  return (
    <FieldRow>
      <TextField label="Início" type="time" error={errors.start?.message} {...register('start')} />
      <TextField
        label="Fim"
        type="time"
        hint={start && end && end < start ? 'Termina no dia seguinte.' : undefined}
        error={errors.end?.message}
        {...register('end')}
      />
    </FieldRow>
  )
}
