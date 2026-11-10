import { minutesOfDay } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { useGridDrop } from '../hooks/useGridDrop'
import type { PlaceInput } from '../hooks/useGridPlacement'
import { movableDates } from '../sessionForm'
import { columnWidthClasses, openDayTitleId, type ColumnMode } from '../weekColumns'
import { layoutDay, type HourRange } from '../weekGrid'
import { freeGapLabels, freeStretch } from '../weekSummary'
import { CollapsedDayColumn } from './CollapsedDayColumn'
import { FreeGapLabel, FreeStretchLabel, GridLines, NowLine } from './DayMarkers'
import { PlannerBlock } from './PlannerBlock'

export type DayColumnProps = {
  day: PlannedDay
  // Os dias da semana, para mudar uma sessão de dia.
  week: PlannedDay[]
  range: HourRange
  today: string
  now: number
  // Encaixa a atividade solta na coluna; pending enquanto o encaixe neste dia não termina.
  onPlace: (input: PlaceInput) => void
  pending: boolean
  mode: ColumnMode
  rowsClass: string
  onOpen: (date: string) => void
}

export function DayColumn(props: DayColumnProps) {
  const { day, range, today, now, mode, rowsClass, onOpen } = props
  if (mode === 'collapsed') {
    const isToday = day.date === today
    return <CollapsedDayColumn day={day} range={range} rowsClass={rowsClass} isPast={day.date < today} now={isToday ? now : undefined} onOpen={onOpen} />
  }
  return <FullDayColumn {...props} />
}

// Dia na visão geral (blocos resumidos) ou aberto (cada bloco, com o dobro da altura).
function FullDayColumn({ day, week, range, today, now, onPlace, pending, mode, rowsClass, onOpen }: DayColumnProps) {
  const { isToday, isPast, freeFrom, showNow, blockIsPast } = columnState(day, range, today, now)
  const drop = useGridDrop({ date: day.date, range, enabled: !isPast, onPlace })
  const isOpen = mode === 'open'

  return (
    <div
      {...drop.handlers}
      data-date={day.date}
      aria-busy={pending || undefined}
      {...(isOpen && { role: 'region', 'aria-labelledby': openDayTitleId(day.date) })}
      className={joinClasses(
        'grid grid-cols-8',
        columnWidthClasses[mode],
        rowsClass,
        isToday && 'rounded-b-control border-x border-b border-action/50',
        drop.isOver && 'bg-action/10',
      )}
    >
      <GridLines range={range} />
      <FreeMarks day={day} range={range} freeFrom={freeFrom} isOpen={isOpen} />
      {layoutDay(day.blocks ?? [], range, isOpen ? 'detail' : 'overview').map((item) => (
        <PlannerBlock
          key={`${item.block.taskId}-${item.block.start}`}
          placed={item}
          date={day.date}
          dates={movableDates(week, item.block.taskId, day.date, today)}
          isPast={blockIsPast(item.block.end)}
          onOpenDay={() => onOpen(day.date)}
          view={isOpen ? 'day' : 'week'}
        />
      ))}
      {showNow && <NowLine now={now} range={range} showTime={isOpen} />}
    </div>
  )
}

function columnState(day: PlannedDay, range: HourRange, today: string, now: number) {
  const isToday = day.date === today
  const isPast = day.date < today
  // De onde o livre conta: agora, se for hoje; o dia todo, se ainda vem; nada, se já passou.
  const freeFrom = isPast ? undefined : isToday ? now : 0
  return {
    isToday,
    isPast,
    freeFrom,
    showNow: isToday && now >= range.startHour * 60 && now < range.endHour * 60,
    blockIsPast: (end: string) => isPast || (isToday && minutesOfDay(end) <= now),
  }
}

type FreeMarksProps = {
  day: PlannedDay
  range: HourRange
  freeFrom?: number
  isOpen: boolean
}

// Onde o dia está livre: no dia aberto, cada trecho com quanto dura; na visão geral, só o maior, pelo período.
function FreeMarks({ day, range, freeFrom, isOpen }: FreeMarksProps) {
  if (freeFrom === undefined) return null
  if (isOpen) return freeGapLabels(day, range, freeFrom).map((gap) => <FreeGapLabel key={gap.start} {...gap} range={range} />)
  const stretch = freeStretch(day, range, freeFrom)
  return stretch ? <FreeStretchLabel start={stretch.start} end={stretch.end} label={stretch.label} range={range} /> : null
}
