import { Check } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { thisWeekdayLabel } from '@/shared/time/dateLabels'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { DayPlanItem, PlannedBlock } from '../api/routineTypes'
import { blockSession } from '../sessionForm'
import { shortRangeLabel } from '../weekBoard'
import { FixedActions } from './FixedActions'
import { SessionDialog } from './SessionDialog'

export type FixedItemProps = {
  block: PlannedBlock
  date: string
  // No dia aberto (ou no celular), o fixo é um botão que mostra o que dá para mudar só neste dia.
  interactive: boolean
  selected: boolean
  onSelect: () => void
  onSkipped: (block: PlannedBlock) => void
}

// Fixo: uma linha fina hachurada com o horário, como na grade do dia. Ajustado neste dia, o horário fica destacado.
export function FixedItem({ block, date, interactive, selected, onSelect, onSkipped }: FixedItemProps) {
  const note = block.adjusted ? `só ${thisWeekdayLabel(fromIsoDate(date))}` : undefined
  if (!interactive) {
    return (
      <li>
        <FixedFace block={block} />
      </li>
    )
  }
  return (
    <li data-category={areaCategoryId(block.area)} className={joinClasses('flex flex-col gap-2 rounded-control', selected && 'bg-surface-alt pb-2')}>
      <button
        type="button"
        aria-expanded={selected}
        onClick={onSelect}
        className={joinClasses(
          'w-full cursor-pointer rounded-control text-left focus-visible:outline-2 focus-visible:outline-action',
          selected && 'outline-2 outline-action',
        )}
      >
        <FixedFace block={block} note={note} roomy />
      </button>
      {selected && (
        <div className="px-2">
          <FixedActions block={block} date={date} onSkipped={onSkipped} onDone={onSelect} />
        </div>
      )}
    </li>
  )
}

type FixedFaceProps = {
  block: PlannedBlock
  note?: string
  roomy?: boolean
}

function FixedFace({ block, note, roomy }: FixedFaceProps) {
  return (
    <div
      data-category={areaCategoryId(block.area)}
      className={joinClasses(
        'fixed-hatch flex min-w-0 flex-col rounded-control border-l-2 border-hue-line type-meta text-ink-muted',
        roomy ? 'px-2.5 py-1.5' : 'px-2 py-0.5',
      )}
    >
      <span className="flex min-w-0 items-baseline gap-2">
        <span className={joinClasses('shrink-0 tabular-nums', block.adjusted && 'font-bold text-peach-ink')}>{shortRangeLabel(block)}</span>
        <span className="truncate font-semibold text-ink">{block.title}</span>
      </span>
      {note && <span className="type-caption font-semibold text-peach-ink">{note}</span>}
    </div>
  )
}

export type SessionItemProps = {
  block: PlannedBlock
  date: string
  // Dias para onde a sessão pode ir; vazio num dia que passou.
  dates: string[]
}

// Sessão com horário: abre a mudança de dia e horário, como na grade.
export function SessionItem({ block, date, dates }: SessionItemProps) {
  const [adjusting, setAdjusting] = useState(false)
  const session = blockSession(block, date)
  const face = <ItemFace area={block.area} title={block.title} meta={shortRangeLabel(block)} done={block.done} />
  if (!session || dates.length === 0) return <li>{face}</li>

  return (
    <li>
      <button type="button" onClick={() => setAdjusting(true)} className="w-full cursor-pointer rounded-control text-left focus-visible:outline-2 focus-visible:outline-action">
        {face}
        <span className="sr-only">. Mudar o horário</span>
      </button>
      <SessionDialog task={session.task} dates={dates} current={session.current} open={adjusting} onClose={() => setAdjusting(false)} />
    </li>
  )
}

// Sem horário: prevista pelos dias de costume, encaixada só pelo período, ou feita.
export function PlanItem({ plan }: { plan: DayPlanItem }) {
  const meta = plan.minutes ? formatDuration(plan.minutes) : 'Pontual'
  return (
    <li>
      <ItemFace area={plan.area} title={plan.title} meta={meta} done={plan.done} />
    </li>
  )
}

type ItemFaceProps = {
  area: string
  title: string
  meta: ReactNode
  done?: boolean
}

function ItemFace({ area, title, meta, done }: ItemFaceProps) {
  return (
    <div
      data-category={areaCategoryId(area)}
      title={title}
      className={joinClasses(
        'flex min-w-0 items-start gap-1.5 rounded-control border-l-4 border-hue-line px-2 py-1.5',
        done ? 'bg-hue text-on-hue' : 'bg-surface-alt text-ink',
      )}
    >
      {done && <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />}
      <div className="min-w-0">
        <p className="line-clamp-2 type-meta font-bold break-words">
          {title}
          {done && <span className="sr-only">, feita</span>}
        </p>
        <p className="type-meta opacity-80">{meta}</p>
      </div>
    </div>
  )
}
