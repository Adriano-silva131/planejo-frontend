import { FieldRow } from '@/shared/ui/FormLayout'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { periodOptions, priorityOptions, timesPerWeekOptions, weekdayOptions } from '../taskLabels'
import type { TaskFieldsProps } from '../types'
import { DurationField } from './DurationField'
import { TimeRangeFields } from './FixedFields'

const oneOffModeOptions = [
  { value: 'deadline', label: 'Não, tem um prazo', description: 'Como entregar um relatório.' },
  { value: 'appointment', label: 'Sim, tem dia e hora', description: 'Como uma consulta ou um corte de cabelo.' },
] as const

export function RecurringFields({ form }: TaskFieldsProps) {
  const { register, formState } = form

  return (
    <>
      <OptionGroup legend="Prioridade" options={priorityOptions} error={formState.errors.priority?.message} {...register('priority')} />
      <OptionGroup
        legend="Quantas vezes por semana?"
        layout="week"
        options={timesPerWeekOptions}
        hint="Em qualquer dia. Você encaixa cada vez na Semana ou no Meu dia, no horário que der."
        error={formState.errors.timesPerWeek?.message}
        {...register('timesPerWeek')}
      />
      <DurationField form={form} legend="Duração de cada vez" />
      <OptionGroup
        legend="Dias de costume"
        multiple
        layout="week"
        options={weekdayOptions}
        hint="Opcional. Só uma preferência: dá para fazer em outro dia."
        {...register('weekdays')}
      />
      <OptionGroup legend="Período preferido" options={periodOptions} {...register('period')} />
    </>
  )
}

export function OneOffFields({ form }: TaskFieldsProps) {
  const { register, watch } = form
  const appointment = watch('oneOffMode') === 'appointment'

  return (
    <>
      <OptionGroup legend="Tem dia e hora marcados?" layout="stack" options={oneOffModeOptions} {...register('oneOffMode')} />
      {appointment ? <AppointmentFields form={form} /> : <DeadlineFields form={form} />}
    </>
  )
}

function AppointmentFields({ form }: TaskFieldsProps) {
  return (
    <>
      <FieldRow>
        <TextField label="Dia" type="date" error={form.formState.errors.date?.message} {...form.register('date')} />
      </FieldRow>
      <TimeRangeFields form={form} />
    </>
  )
}

function DeadlineFields({ form }: TaskFieldsProps) {
  const { register, formState } = form

  return (
    <>
      <OptionGroup legend="Prioridade" options={priorityOptions} error={formState.errors.priority?.message} {...register('priority')} />
      <FieldRow>
        <TextField label="Prazo" type="date" error={formState.errors.deadline?.message} {...register('deadline')} />
      </FieldRow>
      <OptionGroup legend="Período preferido" options={periodOptions} {...register('period')} />
    </>
  )
}
