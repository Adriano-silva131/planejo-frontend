import { fromIsoDate } from '@/shared/time/calendarDate'
import { shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { FormAlert } from '@/shared/ui/FormAlert'
import { FieldRow, FormActions, FormFields } from '@/shared/ui/FormLayout'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { useSessionForm } from '../hooks/useSessionForm'
import type { PlacedSession, SessionTask } from '../sessionForm'

export type SessionDialogProps = {
  task: SessionTask
  // Dias em que dá para encaixar; ao mudar uma sessão, inclui o dia dela.
  dates: string[]
  // Sessão que já está na grade: o diálogo muda o horário ou tira do dia.
  current?: PlacedSession
  open: boolean
  onClose: () => void
}

// O formulário só existe com o diálogo aberto: cada abertura parte do dia e do horário atuais da sessão.
export function SessionDialog({ task, dates, current, open, onClose }: SessionDialogProps) {
  return (
    <Dialog open={open} title={`${current ? 'Mudar' : 'Encaixar'} "${task.title}"`} onClose={onClose}>
      {open && <SessionForm task={task} dates={dates} current={current} onClose={onClose} />}
    </Dialog>
  )
}

type SessionFormProps = Omit<SessionDialogProps, 'open'>

function SessionForm({ task, dates, current, onClose }: SessionFormProps) {
  const { form, submit, removeSession, alert, isSaving } = useSessionForm({ task, dates, current, onDone: onClose })
  const { register, formState } = form

  return (
    <form noValidate onSubmit={(event) => void submit(event)}>
      <FormFields>
        <OptionGroup legend="Dia" options={dates.map(dayOption)} error={formState.errors.date?.message} {...register('date')} />
        <FieldRow>
          <TextField label="Começa às" type="time" required error={formState.errors.start?.message} {...register('start')} />
          <TextField
            label="Termina às"
            type="time"
            required={task.kind === 'one_off'}
            hint={endHint(task)}
            error={formState.errors.end?.message}
            {...register('end')}
          />
        </FieldRow>
        {alert && <FormAlert>{alert}</FormAlert>}
        <FormActions
          start={
            removeSession && (
              <Button variant="ghost" disabled={isSaving} onClick={removeSession}>
                Tirar do dia
              </Button>
            )
          }
        >
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando…' : current ? 'Salvar' : 'Encaixar'}
          </Button>
        </FormActions>
      </FormFields>
    </form>
  )
}

function dayOption(date: string) {
  const day = fromIsoDate(date)
  return { value: date, label: `${shortWeekdayLabel(day)} ${day.getDate()}` }
}

function endHint(task: SessionTask) {
  if (task.kind === 'one_off') return 'Só para esta vez.'
  if (task.durationMinutes === undefined) return 'Opcional. Sem fim, dura o tempo da atividade.'
  return `Opcional. Sem fim, dura ${formatDuration(task.durationMinutes)}.`
}
