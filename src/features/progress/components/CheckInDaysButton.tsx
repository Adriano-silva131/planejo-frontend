import { CalendarCheck, Check } from 'lucide-react'
import { useState } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { shortWeekdayLabel } from '@/shared/time/dateLabels'
import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { FormAlert } from '@/shared/ui/FormAlert'
import { joinClasses } from '@/shared/ui/joinClasses'
import { useCheckIn, useUndoCheckIn } from '../api/progressQueries'
import type { HabitDay } from '../api/progressTypes'

export type CheckInDaysButtonProps = {
  taskId: string
  title: string
  // Dias da semana até hoje.
  days: HabitDay[]
}

// Registra ou desfaz o feito em outro dia da semana, para quando a pessoa esqueceu de marcar na hora.
export function CheckInDaysButton({ taskId, title, days }: CheckInDaysButtonProps) {
  const [open, setOpen] = useState(false)
  const checkIn = useCheckIn()
  const undo = useUndoCheckIn()
  const pending = checkIn.isPending || undo.isPending
  const error = checkIn.error ?? undo.error
  const toggle = (day: HabitDay) => (day.done ? undo : checkIn).mutate({ taskId, date: day.date })
  const close = () => {
    checkIn.reset()
    undo.reset()
    setOpen(false)
  }

  return (
    <>
      <Button variant="ghost" size="icon" aria-label={`Registrar ${title} em outro dia`} onClick={() => setOpen(true)} className="text-ink-muted">
        <CalendarCheck aria-hidden="true" className="size-5" />
      </Button>
      <Dialog open={open} title={`Quando você fez "${title}"?`} onClose={close}>
        <p className="type-meta text-ink-muted">Marque os dias em que fez. Toque de novo para desfazer.</p>
        <div role="group" aria-label="Dias da semana" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {days.map((day) => (
            <DayToggle key={day.date} day={day} disabled={pending} onToggle={toggle} />
          ))}
        </div>
        {error && <FormAlert>{error.message}</FormAlert>}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={close}>
            Fechar
          </Button>
        </div>
      </Dialog>
    </>
  )
}

type DayToggleProps = {
  day: HabitDay
  disabled: boolean
  onToggle: (day: HabitDay) => void
}

function DayToggle({ day, disabled, onToggle }: DayToggleProps) {
  const date = fromIsoDate(day.date)
  return (
    <button
      type="button"
      aria-pressed={day.done}
      disabled={disabled}
      onClick={() => onToggle(day)}
      className={joinClasses(
        'flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-control border type-meta tabular-nums',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-50',
        day.done ? 'border-action bg-action text-on-action' : 'border-line text-ink hover:bg-ink/5',
      )}
    >
      <span>{shortWeekdayLabel(date)}</span>
      <span className="flex items-center gap-1 type-label">
        {day.done && <Check aria-hidden="true" className="size-3.5" />}
        {date.getDate()}
      </span>
    </button>
  )
}
