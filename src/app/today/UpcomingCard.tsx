import { Check } from 'lucide-react'
import { useCheckIn, useWeekProgress } from '@/features/progress/api/progressQueries'
import { useTasks } from '@/features/tasks/api/taskQueries'
import { toIsoDate } from '@/shared/time/calendarDate'
import { daysLeftLabel } from '@/shared/time/dateLabels'
import { useNow } from '@/shared/time/useNow'
import { joinClasses } from '@/shared/ui/joinClasses'
import { upcomingItems, type UpcomingItem } from './upcomingItems'

export function UpcomingCard() {
  const today = toIsoDate(useNow())
  const progress = useWeekProgress(today)
  const tasks = useTasks(1)

  if (!progress.isSuccess || !tasks.isSuccess) return null
  const items = upcomingItems(progress.data, tasks.data.data ?? [], today)
  if (items.length === 0) return null
  const open = items.filter((item) => item.completable).length

  return (
    <section aria-labelledby="upcoming-title" className="flex flex-col gap-1 rounded-card bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="upcoming-title" className="type-label">
          Prazos e compromissos
        </h2>
        {open > 0 && <p className="shrink-0 type-meta text-ink-muted">{`${open} em aberto`}</p>}
      </div>
      <ul>
        {items.map((item) => (
          <UpcomingRow key={item.taskId} item={item} today={today} />
        ))}
      </ul>
    </section>
  )
}

type UpcomingRowProps = {
  item: UpcomingItem
  today: string
}

function UpcomingRow({ item, today }: UpcomingRowProps) {
  return (
    <li className="flex items-center gap-3 border-t border-line py-2 first:border-t-0">
      <DaysTile days={item.days} urgent={item.urgent} />
      <div className="min-w-0 flex-1">
        <p className="truncate type-label">{item.title}</p>
        <p className="truncate type-meta text-ink-muted">{item.when}</p>
      </div>
      {item.completable && <CompleteButton taskId={item.taskId} title={item.title} today={today} />}
    </li>
  )
}

type DaysTileProps = {
  days: number
  urgent: boolean
}

function DaysTile({ days, urgent }: DaysTileProps) {
  const [amount, unit] = tileText(days)
  return (
    <span
      role="img"
      aria-label={daysLeftLabel(days)}
      className={joinClasses(
        'flex size-11 shrink-0 flex-col items-center justify-center rounded-control tabular-nums',
        urgent ? 'bg-peach text-on-peach' : 'bg-surface-alt text-ink',
      )}
    >
      <span className={unit ? 'type-label leading-none' : 'type-meta font-bold'}>{amount}</span>
      {unit && <span className="type-meta leading-none">{unit}</span>}
    </span>
  )
}

function tileText(days: number): [string, string?] {
  if (days === 0) return ['hoje']
  if (days < 0) return [String(-days), 'atraso']
  return [String(days), days === 1 ? 'dia' : 'dias']
}

type CompleteButtonProps = {
  taskId: string
  title: string
  today: string
}

// Concluir registra hoje como o dia da entrega; a pontual sai do card quando o progresso recarrega.
function CompleteButton({ taskId, title, today }: CompleteButtonProps) {
  const checkIn = useCheckIn()

  return (
    <span className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        aria-label={`Concluir "${title}"`}
        disabled={checkIn.isPending}
        onClick={() => checkIn.mutate({ taskId, date: today })}
        className="group flex size-11 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-action disabled:cursor-default disabled:opacity-50"
      >
        <span className="flex size-8 items-center justify-center rounded-full border border-line group-hover:border-ink/50">
          <Check aria-hidden="true" className="size-4" />
        </span>
      </button>
      {checkIn.error && (
        <span role="alert" className="type-meta text-danger">
          {checkIn.error.message}
        </span>
      )}
    </span>
  )
}
