import { FieldRow } from '@/shared/ui/FormLayout'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { weekdayOptions } from '../taskLabels'
import type { TaskFieldsProps } from '../types'

const repeatOptions = [
  { value: 'weekdays', label: 'Toda semana' },
  { value: 'date', label: 'Num dia só' },
] as const

export function FixedFields({ form }: TaskFieldsProps) {
  const { register, formState, watch } = form
  const [repeat, start, end] = watch(['fixedRepeat', 'start', 'end'])
  const { errors } = formState

  return (
    <>
      <OptionGroup legend="Repete" options={repeatOptions} {...register('fixedRepeat')} />
      {repeat === 'weekdays' ? (
        <OptionGroup legend="Dias" multiple layout="week" options={weekdayOptions} error={errors.weekdays?.message} {...register('weekdays')} />
      ) : (
        <FieldRow>
          <TextField label="Dia" type="date" error={errors.date?.message} {...register('date')} />
        </FieldRow>
      )}
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
    </>
  )
}
