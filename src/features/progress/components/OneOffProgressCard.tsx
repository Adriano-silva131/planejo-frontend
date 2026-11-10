import { Check } from 'lucide-react'
import { daysBetween, fromIsoDate } from '@/shared/time/calendarDate'
import { daysLeftLabel } from '@/shared/time/dateLabels'
import { shortDateLabel } from '@/shared/time/week'
import { joinClasses } from '@/shared/ui/joinClasses'
import { useCheckIn, useUndoCheckIn } from '../api/progressQueries'
import type { OneOffProgress } from '../api/progressTypes'

export type OneOffProgressCardProps = {
  items: OneOffProgress[]
  today: string
  canCheckIn: boolean
}

const urgentDays = 3

export function OneOffProgressCard({ items, today, canCheckIn }: OneOffProgressCardProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="one-off-progress-title" className="flex flex-col gap-2 rounded-card bg-surface p-5">
      <h2 id="one-off-progress-title" className="type-label">
        Pontuais
      </h2>
      <ul>
        {items.map((item) => (
          <OneOffRow key={item.taskId} item={item} today={today} canCheckIn={canCheckIn} />
        ))}
      </ul>
    </section>
  )
}

type OneOffRowProps = {
  item: OneOffProgress
  today: string
  canCheckIn: boolean
}

function OneOffRow({ item, today, canCheckIn }: OneOffRowProps) {
  return (
    <li className="flex flex-col gap-1 border-t border-line py-3 first:border-t-0">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate type-label">{item.title}</p>
        <Badge item={item} today={today} />
      </div>
      <div className="flex items-center justify-between gap-3 type-meta">
        <span className="text-ink-muted">
          {item.completedOn ? deliveredText(item.completedOn, item.deadline) : `Até ${shortDateLabel(fromIsoDate(item.deadline))}`}
        </span>
        {canCheckIn && <CompletionButton item={item} today={today} />}
      </div>
    </li>
  )
}

type CompletionButtonProps = {
  item: OneOffProgress
  today: string
}

// Concluir registra o dia de hoje; reabrir desfaz o registro do dia em que foi concluída.
function CompletionButton({ item, today }: CompletionButtonProps) {
  const checkIn = useCheckIn()
  const undo = useUndoCheckIn()
  const pending = checkIn.isPending || undo.isPending
  const error = checkIn.error ?? undo.error
  const { completedOn } = item

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => (completedOn ? undo.mutate({ taskId: item.taskId, date: completedOn }) : checkIn.mutate({ taskId: item.taskId, date: today }))}
        className="cursor-pointer font-bold hover:underline focus-visible:outline-2 focus-visible:outline-action disabled:cursor-default disabled:opacity-50"
      >
        {completedOn ? 'Reabrir' : 'Concluir'}
      </button>
      {error && (
        <span role="alert" className="text-danger">
          {error.message}
        </span>
      )}
    </span>
  )
}

type BadgeProps = {
  item: OneOffProgress
  today: string
}

function Badge({ item, today }: BadgeProps) {
  if (item.completedOn) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 type-meta font-bold text-action">
        <Check aria-hidden="true" className="size-4" />
        Concluída
      </span>
    )
  }
  const days = daysBetween(today, item.deadline)
  const urgent = days <= urgentDays
  return (
    <span className={joinClasses('shrink-0 type-meta whitespace-nowrap', urgent ? 'rounded-control bg-peach px-2 py-0.5 font-bold text-on-peach' : 'text-ink-muted')}>
      {daysLeftLabel(days)}
    </span>
  )
}

function deliveredText(completedOn: string, deadline: string) {
  const early = daysBetween(completedOn, deadline)
  const when = `Entregue em ${shortDateLabel(fromIsoDate(completedOn))}`
  if (early === 0) return `${when}, no dia do prazo`
  if (early > 0) return `${when}, ${early === 1 ? '1 dia' : `${early} dias`} antes do prazo`
  return `${when}, ${-early === 1 ? '1 dia' : `${-early} dias`} depois do prazo`
}
