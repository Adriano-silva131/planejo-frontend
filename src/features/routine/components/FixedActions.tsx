import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { thisWeekdayLabel } from '@/shared/time/dateLabels'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import { TextField } from '@/shared/ui/TextField'
import { useMoveOccurrence, useResetOccurrence, useSkipOccurrence } from '../api/useOccurrenceActions'
import type { PlannedBlock } from '../api/routineTypes'
import { sessionErrorMessage } from '../sessionForm'

// Botões compactos das ações dentro do item; os da página (min-h-12) não cabem na coluna do dia.
const actionClasses =
  'inline-flex min-h-9 cursor-pointer items-center rounded-control border border-line bg-surface-alt px-3 type-meta font-semibold hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-50'
const primaryClasses =
  'inline-flex min-h-9 cursor-pointer items-center rounded-control bg-action px-3 type-meta font-bold text-on-action hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-50'
const linkClasses =
  'inline-flex min-h-9 cursor-pointer items-center rounded-control px-2 type-meta font-semibold text-action hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-50'

const failure = 'Não deu para mudar agora. Tente de novo.'

export type FixedActionsProps = {
  block: PlannedBlock
  date: string
  // O fixo saiu do dia: quem mostra o aviso com Desfazer é o dia, porque o item some da rotina.
  onSkipped: (block: PlannedBlock) => void
  onDone: () => void
}

// O que dá para fazer com um fixo só neste dia: mudar o horário, tirar ou voltar ao padrão.
export function FixedActions({ block, date, onSkipped, onDone }: FixedActionsProps) {
  const [editing, setEditing] = useState(false)
  const skip = useSkipOccurrence()
  const reset = useResetOccurrence()
  const target = { taskId: block.taskId, date }
  const day = thisWeekdayLabel(fromIsoDate(date))
  const error = skip.error ?? reset.error
  const pending = skip.isPending || reset.isPending

  if (editing) return <OccurrenceTimeForm block={block} date={date} onCancel={() => setEditing(false)} onSaved={onDone} />

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={actionClasses} disabled={pending} onClick={() => setEditing(true)}>
          Mudar horário
        </button>
        <button type="button" className={actionClasses} disabled={pending} onClick={() => skip.mutate(target, { onSuccess: () => onSkipped(block) })}>
          {`Não vai ter ${day}`}
        </button>
        {block.adjusted && (
          <button type="button" className={linkClasses} disabled={pending} onClick={() => reset.mutate(target, { onSuccess: onDone })}>
            Voltar ao padrão
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="type-meta text-danger">
          {sessionErrorMessage(error, failure)}
        </p>
      )}
    </div>
  )
}

type OccurrenceTimeFormProps = {
  block: PlannedBlock
  date: string
  onCancel: () => void
  onSaved: () => void
}

function OccurrenceTimeForm({ block, date, onCancel, onSaved }: OccurrenceTimeFormProps) {
  const [start, setStart] = useState(block.start)
  const [end, setEnd] = useState(block.end === timeOfDayLabel(minutesInDay) ? '00:00' : block.end)
  const [invalid, setInvalid] = useState<string>()
  const move = useMoveOccurrence()
  const day = thisWeekdayLabel(fromIsoDate(date))
  const message = invalid ?? (move.error ? sessionErrorMessage(move.error, failure) : undefined)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!start || !end) return setInvalid('Informe o início e o fim.')
    if (start === end) return setInvalid('O fim precisa ser diferente do início.')
    setInvalid(undefined)
    move.mutate({ taskId: block.taskId, date, start, end }, { onSuccess: onSaved })
  }
  // Esc cancela a mudança sem fechar o dia aberto.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    event.stopPropagation()
    onCancel()
  }

  return (
    <form noValidate onSubmit={submit} onKeyDown={onKeyDown} className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Começa às" type="time" required value={start} onChange={(event) => setStart(event.target.value)} />
        <TextField
          label="Termina às"
          type="time"
          required
          value={end}
          hint={end && end !== '00:00' && end < start ? 'Termina no dia seguinte.' : undefined}
          onChange={(event) => setEnd(event.target.value)}
        />
      </div>
      {message && (
        <p role="alert" className="type-meta text-danger">
          {message}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        <button type="submit" className={primaryClasses} disabled={move.isPending}>
          {move.isPending ? 'Salvando…' : `Salvar só ${day}`}
        </button>
        <button type="button" className={linkClasses} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
