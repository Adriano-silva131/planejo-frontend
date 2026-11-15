import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { longDateLabel, shortWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedBlock, PlannedDay } from '../api/routineTypes'
import { movableDates } from '../sessionForm'
import { openDayTitleId } from '../weekColumns'
import { boardDay, dayRoom, showsPeriod, type BoardDay, type BoardPeriod } from '../weekBoard'
import { FixedItem, PlanItem, SessionItem } from './BoardItems'
import { OpenBoardDayHeader } from './OpenBoardDayHeader'
import { SkippedNotice } from './SkippedNotice'

// overview: uma das sete colunas do quadro. open: o dia aberto, onde cada fixo mostra o que dá para mudar.
// single: o dia escolhido no celular, sem cabeçalho e com as mesmas ações do dia aberto.
export type BoardDayMode = 'overview' | 'open' | 'single'

export type BoardDayColumnProps = {
  day: PlannedDay
  // Os dias da semana, para mudar uma sessão de dia.
  week: PlannedDay[]
  today: string
  now: number
  mode: BoardDayMode
  onOpen?: (date: string) => void
  onClose?: () => void
  // No dia aberto: a troca entre períodos e horários, e o que dá para encaixar nele.
  viewToggle?: ReactNode
  footer?: ReactNode
}

export function BoardDayColumn({ day, week, today, now, mode, onOpen, onClose, viewToggle, footer }: BoardDayColumnProps) {
  const board = boardDay(day, today, now)
  const periods = board.periods.filter(showsPeriod)
  const { items, skipped, undo } = useDayItems(day.date, mode !== 'overview' && !board.isPast, (taskId) =>
    board.isPast ? [] : movableDates(week, taskId, day.date, today),
  )

  // Esc fecha o dia aberto, a não ser que venha de um diálogo ou de uma mudança de horário, que tratam o Esc.
  const onKeyDown = (event: KeyboardEvent) => {
    if (mode !== 'open' || event.key !== 'Escape' || (event.target as Element).closest('dialog, form')) return
    onClose?.()
  }

  return (
    <section
      aria-label={mode === 'open' ? undefined : longDateLabel(fromIsoDate(day.date))}
      aria-labelledby={mode === 'open' ? openDayTitleId(day.date) : undefined}
      onKeyDown={onKeyDown}
      className={columnClasses(mode, board)}
    >
      <DayHeading mode={mode} board={board} onOpen={onOpen} onClose={onClose} viewToggle={viewToggle} />
      {skipped.map((block) => (
        <SkippedNotice key={`${block.taskId}-${block.start}`} block={block} date={day.date} onUndone={() => undo(block)} />
      ))}
      {board.loose.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {board.loose.map((plan) => (
            <PlanItem key={`${plan.taskId}-${plan.source}`} plan={plan} />
          ))}
        </ul>
      )}
      {periods.map((period) => (
        <BoardPeriodSection key={period.id} period={period} items={items} />
      ))}
      {periods.length === 0 && board.loose.length === 0 && (
        <p className="px-1 type-meta text-ink-muted">{board.isPast ? 'Nada registrado.' : 'Nada marcado.'}</p>
      )}
      {mode === 'open' && footer}
    </section>
  )
}

function columnClasses(mode: BoardDayMode, board: BoardDay) {
  if (mode === 'open') return 'flex min-w-0 flex-col gap-4 rounded-card border-2 border-action bg-surface p-4'
  if (mode === 'single') return 'flex min-w-0 flex-col gap-3 rounded-card bg-surface p-2.5'
  return joinClasses(
    'flex min-w-0 flex-col gap-3 rounded-card p-2.5',
    board.isPast ? 'border border-line' : 'bg-surface',
    board.isToday && 'ring-2 ring-action',
  )
}

// O item escolhido mostra as ações; o fixo tirado do dia vira um aviso com Desfazer.
function useDayItems(date: string, interactive: boolean, dates: (taskId: string) => string[]) {
  const [selected, setSelected] = useState<string>()
  const [skipped, setSkipped] = useState<PlannedBlock[]>([])
  const items: PeriodItems = {
    date,
    interactive,
    selected,
    dates,
    onSelect: (key) => setSelected((current) => (current === key ? undefined : key)),
    onSkipped: (block) => {
      setSelected(undefined)
      setSkipped((current) => [...current, block])
    },
  }
  return { items, skipped, undo: (block: PlannedBlock) => setSkipped((current) => current.filter((item) => item !== block)) }
}

type DayHeadingProps = {
  mode: BoardDayMode
  board: BoardDay
  onOpen?: (date: string) => void
  onClose?: () => void
  viewToggle?: ReactNode
}

function DayHeading({ mode, board, onOpen, onClose, viewToggle }: DayHeadingProps) {
  if (mode === 'open') {
    return <OpenBoardDayHeader date={board.date} isToday={board.isToday} room={dayRoom(board)} viewToggle={viewToggle} onClose={onClose} />
  }
  if (mode === 'overview' && onOpen) return <BoardDayHeader date={board.date} isToday={board.isToday} onOpen={onOpen} />
  return null
}

type BoardDayHeaderProps = {
  date: string
  isToday: boolean
  onOpen: (date: string) => void
}

// O dia abre no próprio quadro; ao fechar, o foco volta para cá (data-day-toggle).
function BoardDayHeader({ date, isToday, onOpen }: BoardDayHeaderProps) {
  const day = fromIsoDate(date)
  return (
    <h2>
      <button
        type="button"
        data-day-toggle={date}
        onClick={() => onOpen(date)}
        aria-label={`Abrir ${longDateLabel(day)}${isToday ? ', hoje' : ''}`}
        className="flex w-full cursor-pointer items-baseline gap-1.5 rounded-control px-1 py-0.5 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-action"
      >
        <span className={joinClasses('type-meta', isToday ? 'text-action' : 'text-ink-muted')}>{shortWeekdayLabel(day)}</span>
        <span className={joinClasses('type-label tabular-nums', isToday && 'text-action')}>{day.getDate()}</span>
        {isToday && <span className="type-meta text-action">hoje</span>}
      </button>
    </h2>
  )
}

type PeriodItems = {
  date: string
  interactive: boolean
  selected?: string
  dates: (taskId: string) => string[]
  onSelect: (key: string) => void
  onSkipped: (block: PlannedBlock) => void
}

function BoardPeriodSection({ period, items }: { period: BoardPeriod; items: PeriodItems }) {
  const hasItems = period.fixed.length + period.sessions.length + period.plans.length > 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 px-1 type-meta">
        <h3 className="font-bold">{period.label}</h3>
        <PeriodRoom period={period} />
      </div>
      {hasItems && (
        <ul className="flex flex-col gap-1.5">
          {period.fixed.map((block) => {
            const key = `${block.taskId}-${block.start}`
            return (
              <FixedItem
                key={key}
                block={block}
                date={items.date}
                interactive={items.interactive && !block.continuesFromPreviousDay}
                selected={items.selected === key}
                onSelect={() => items.onSelect(key)}
                onSkipped={items.onSkipped}
              />
            )
          })}
          {period.sessions.map((block) => (
            <SessionItem key={`${block.taskId}-${block.start}`} block={block} date={items.date} dates={items.dates(block.taskId)} />
          ))}
          {period.plans.map((plan) => (
            <PlanItem key={`${plan.taskId}-${plan.source}`} plan={plan} />
          ))}
        </ul>
      )}
    </div>
  )
}

// Quanto ainda cabe no período, ou quanto o que vem sem horário passa do livre.
function PeriodRoom({ period }: { period: BoardPeriod }) {
  if (period.freeMinutes === undefined || period.freeMinutes <= 0) return null
  const left = period.freeMinutes - period.plannedMinutes
  if (left < 0) return <span className="font-bold whitespace-nowrap text-peach-ink">{`passa ${formatDuration(-left)}`}</span>
  return <span className="whitespace-nowrap text-ink-muted tabular-nums">{left === 0 ? 'cheio' : `${formatDuration(left)} livres`}</span>
}
