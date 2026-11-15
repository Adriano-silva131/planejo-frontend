import { useState, type ReactNode } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { fieldLabelClasses, FieldMessages } from '@/shared/ui/FieldMessages'
import { TextField } from '@/shared/ui/TextField'
import { useTaskAreas } from '../api/taskQueries'
import type { Days } from '../hooks/useQuickAddDays'
import type { QuickAddValues } from '../quickAdd'

// Os campos do Adicionar rápido: quando, horário opcional e área.
type WhenFieldProps = {
  date: string
  days: Days
  error?: string
  onChange: (date: string) => void
}

export function WhenField({ date, days, error, onChange }: WhenFieldProps) {
  const [other, setOther] = useState(date !== days.today && date !== days.tomorrow)
  const pick = (value: string) => {
    setOther(false)
    onChange(value)
  }
  return (
    <fieldset>
      <legend className={fieldLabelClasses}>Quando?</legend>
      <div className="flex flex-wrap items-center gap-2">
        <Chip name="quick-add-when" checked={!other && date === days.today} onChange={() => pick(days.today)}>
          Hoje
        </Chip>
        <Chip name="quick-add-when" checked={!other && date === days.tomorrow} onChange={() => pick(days.tomorrow)}>
          Amanhã
        </Chip>
        <Chip name="quick-add-when" checked={other} onChange={() => setOther(true)}>
          Outro dia
        </Chip>
        {other && (
          <input
            type="date"
            aria-label="Dia"
            min={days.today}
            value={date}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-10 rounded-control border border-line bg-surface px-3 text-ink focus-visible:border-action focus-visible:outline-2 focus-visible:outline-action"
          />
        )}
      </div>
      <FieldMessages error={error} />
    </fieldset>
  )
}

type TimeFieldsProps = {
  values: QuickAddValues
  startError?: string
  endError?: string
  onStart: (value: string) => void
  onEnd: (value: string) => void
}

export function TimeFields({ values, startError, endError, onStart, onEnd }: TimeFieldsProps) {
  const hasTime = Boolean(values.start || values.end)
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Horário</legend>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Começa às" type="time" value={values.start} error={startError} onChange={(event) => onStart(event.target.value)} />
        <TextField label="Termina às" type="time" value={values.end} error={endError} onChange={(event) => onEnd(event.target.value)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="type-meta text-ink-muted">Opcional. Sem horário, vira prazo.</p>
        {hasTime && (
          <button
            type="button"
            onClick={() => {
              onStart('')
              onEnd('')
            }}
            className="cursor-pointer rounded-control type-meta font-semibold text-action hover:underline focus-visible:outline-2 focus-visible:outline-action"
          >
            Tirar horário
          </button>
        )}
      </div>
    </fieldset>
  )
}

type AreaFieldProps = {
  value: string
  error?: string
  onChange: (value: string) => void
}

// As áreas que já existem viram um toque; uma nova se digita.
export function AreaField({ value, error, onChange }: AreaFieldProps) {
  const areas = useTaskAreas()
  const names = (areas.data ?? []).map((item) => item.area)
  const [typing, setTyping] = useState(areas.isSuccess && names.length === 0)
  const known = names.includes(value)
  const showInput = typing || (value !== '' && !known && areas.isSuccess)

  return (
    <fieldset>
      <legend className={fieldLabelClasses}>Área</legend>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <Chip key={name} name="quick-add-area" category={name} checked={!showInput && value === name} onChange={() => {
            setTyping(false)
            onChange(name)
          }}>
            {name}
          </Chip>
        ))}
        <Chip name="quick-add-area" checked={showInput} onChange={() => {
          setTyping(true)
          onChange('')
        }}>
          Outra…
        </Chip>
      </div>
      {showInput && (
        <TextField label="Nome da área" className="mt-3" placeholder="Ex.: Esporte" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      <FieldMessages error={error} />
    </fieldset>
  )
}

type ChipProps = {
  name: string
  checked: boolean
  onChange: () => void
  // Área: o ponto ganha a cor dela.
  category?: string
  children: ReactNode
}

function Chip({ name, checked, onChange, category, children }: ChipProps) {
  return (
    <label className="cursor-pointer" data-category={category ? areaCategoryId(category) : undefined}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-3 type-meta font-semibold peer-checked:border-action peer-checked:bg-action peer-checked:text-on-action peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action">
        {category && <span aria-hidden="true" className="size-2 rounded-full bg-hue-line" />}
        {children}
      </span>
    </label>
  )
}
