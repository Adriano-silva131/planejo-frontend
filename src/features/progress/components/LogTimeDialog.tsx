import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { applyFieldErrors } from '@/shared/api/applyFieldErrors'
import { Button } from '@/shared/ui/Button'
import { CheckboxField } from '@/shared/ui/CheckboxField'
import { Dialog } from '@/shared/ui/Dialog'
import { FormAlert } from '@/shared/ui/FormAlert'
import { FormActions, FormFields } from '@/shared/ui/FormLayout'
import { TextField } from '@/shared/ui/TextField'
import { useCheckIn } from '../api/progressQueries'
import type { OneOffProgress } from '../api/progressTypes'

const logTimeSchema = z.object({
  minutes: z
    .string()
    .refine((value) => /^\d+$/.test(value) && Number(value) <= 1440, 'Informe os minutos de hoje, de 0 a 1440.'),
  completed: z.boolean(),
})

type LogTimeValues = z.infer<typeof logTimeSchema>

export type LogTimeDialogProps = {
  item: OneOffProgress
  date: string
  open: boolean
  onClose: () => void
}

export function LogTimeDialog({ item, date, open, onClose }: LogTimeDialogProps) {
  const checkIn = useCheckIn()
  const form = useForm<LogTimeValues>({ resolver: zodResolver(logTimeSchema), defaultValues: { minutes: '', completed: false } })
  const { register, formState, setError } = form

  const submit = form.handleSubmit(({ minutes, completed }) =>
    checkIn.mutate(
      { taskId: item.taskId, date, fields: { minutes: Number(minutes), completed } },
      {
        onSuccess: () => {
          form.reset()
          onClose()
        },
        onError: (error) => {
          const message = applyFieldErrors(error, setError, ['minutes', 'completed'])
          if (message) setError('root', { message })
        },
      },
    ),
  )

  return (
    <Dialog open={open} title={`Tempo em "${item.title}"`} onClose={onClose}>
      <form noValidate onSubmit={submit}>
        <FormFields>
          <TextField
            label="Minutos dedicados hoje"
            type="number"
            min={0}
            max={1440}
            inputMode="numeric"
            hint="Se você já registrou hoje, este valor substitui o anterior."
            error={formState.errors.minutes?.message}
            {...register('minutes')}
          />
          <CheckboxField label="Concluí esta tarefa" {...register('completed')} />
          {formState.errors.root && <FormAlert>{formState.errors.root.message}</FormAlert>}
          <FormActions>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={checkIn.isPending}>
              {checkIn.isPending ? 'Salvando…' : 'Registrar'}
            </Button>
          </FormActions>
        </FormFields>
      </form>
    </Dialog>
  )
}
