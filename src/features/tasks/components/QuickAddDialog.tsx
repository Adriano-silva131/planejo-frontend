import { CalendarClock, Flag } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError } from '@/shared/api/apiError'
import type { QuickAddDraft } from '@/shared/planning/quickAdd'
import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { joinClasses } from '@/shared/ui/joinClasses'
import { TextField } from '@/shared/ui/TextField'
import { useSaveTask } from '../api/taskQueries'
import type { Task } from '../api/taskTypes'
import { quickAddKind, quickAddProblem, toQuickAddPayload, type QuickAddKind, type QuickAddProblem, type QuickAddValues } from '../quickAdd'
import { rememberQuickAddArea, rememberedQuickAddArea } from '../quickAddArea'
import { useQuickAddDays } from '../hooks/useQuickAddDays'
import { AreaField, TimeFields, WhenField } from './QuickAddFields'

export type QuickAdded = { task: Task; kind: QuickAddKind; when: string }

export type QuickAddDialogProps = {
  open: boolean
  draft?: QuickAddDraft
  onClose: () => void
  onAdded: (added: QuickAdded) => void
}

export function QuickAddDialog({ open, draft, onClose, onAdded }: QuickAddDialogProps) {
  return (
    <Dialog open={open} title="Adicionar" onClose={onClose}>
      {open && <QuickAddForm draft={draft} onClose={onClose} onAdded={onAdded} />}
    </Dialog>
  )
}

type QuickAddFormProps = Omit<QuickAddDialogProps, 'open'>

function QuickAddForm({ draft, onClose, onAdded }: QuickAddFormProps) {
  const days = useQuickAddDays()
  const save = useSaveTask()
  const [values, setValues] = useState<QuickAddValues>(() => ({
    title: '',
    date: draft?.date && draft.date >= days.today ? draft.date : days.today,
    start: '',
    end: '',
    area: rememberedQuickAddArea(),
  }))
  const [problem, setProblem] = useState<QuickAddProblem>()
  const kind = quickAddKind(values)
  const set = (field: keyof QuickAddValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setProblem(undefined)
  }
  const errorOf = (field: keyof QuickAddValues) => (problem?.field === field ? problem.message : undefined)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found = quickAddProblem(values)
    if (found) return setProblem(found)
    save.mutate(
      { fields: toQuickAddPayload(values) },
      {
        onSuccess: (task) => {
          rememberQuickAddArea(values.area)
          onAdded({ task, kind, when: days.label(values.date) })
        },
      },
    )
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-5">
      <TextField
        label="O quê?"
        autoFocus
        placeholder="Ex.: vôlei, consulta, mandar o relatório"
        value={values.title}
        error={errorOf('title')}
        onChange={(event) => set('title')(event.target.value)}
      />
      <WhenField date={values.date} days={days} error={errorOf('date')} onChange={set('date')} />
      <TimeFields values={values} startError={errorOf('start')} endError={errorOf('end')} onStart={set('start')} onEnd={set('end')} />
      <AreaField value={values.area} error={errorOf('area')} onChange={set('area')} />
      <QuickAddOutcome values={values} when={days.label(values.date)} />
      {save.error && (
        <p role="alert" className="type-meta text-danger">
          {save.error instanceof ApiError ? save.error.message : 'Não deu para adicionar agora. Tente de novo.'}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Link to="/atividades?atividade=nova" onClick={onClose} className="rounded-control type-meta font-semibold text-action hover:underline focus-visible:outline-2 focus-visible:outline-action">
          Mais opções
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Adicionando…' : kind === 'appointment' ? 'Adicionar compromisso' : 'Adicionar com prazo'}
          </Button>
        </div>
      </div>
    </form>
  )
}

// O que vai acontecer ao adicionar, sempre à vista: sem horário vira prazo, e isso não pode ser surpresa.
function QuickAddOutcome({ values, when }: { values: QuickAddValues; when: string }) {
  const appointment = quickAddKind(values) === 'appointment'
  const range = values.start && values.end ? `, das ${values.start} às ${values.end}` : ''
  return (
    <div
      aria-live="polite"
      className={joinClasses('flex items-start gap-3 rounded-control p-3', appointment ? 'bg-highlight text-ink' : 'bg-peach text-on-peach')}
    >
      {appointment ? <CalendarClock aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> : <Flag aria-hidden="true" className="mt-0.5 size-5 shrink-0" />}
      {appointment ? (
        <p className="type-meta">
          <strong>Compromisso</strong> · {when}
          {range}. Aparece na Semana nesse horário.
        </p>
      ) : (
        <p className="type-meta">
          <strong>Prazo</strong> · fazer até {when}. Sem horário, fica em <strong>Para encaixar</strong> até você escolher quando fazer.
        </p>
      )}
    </div>
  )
}
