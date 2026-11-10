import { useState } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedBlock } from '../api/routineTypes'
import { expandedFaceClasses, shortBlockMinutes } from '../blockFace'
import { blockMinutes, blockTimeLabel } from '../blockTime'
import type { PlacedBlock } from '../weekGrid'
import { blockSession } from '../sessionForm'
import { SessionDialog } from './SessionDialog'

const laneClasses = ['col-span-full z-10', 'col-start-2 col-span-7 z-20', 'col-start-3 col-span-6 z-30', 'col-start-4 col-span-5 z-40']

export type PlannerBlockProps = {
  placed: PlacedBlock
  date: string
  // Dias para onde a sessão pode ir.
  dates: string[]
  isPast: boolean
}

// Sessão encaixada é um botão que abre a mudança de horário; bloco de fixa só mostra os detalhes.
export function PlannerBlock({ placed, date, dates, isPast }: PlannerBlockProps) {
  const { block, rowStart, rowSpan, lane, overlaps } = placed
  const short = blockMinutes(block) < shortBlockMinutes
  const [adjusting, setAdjusting] = useState(false)
  const session = blockSession(block, date)
  const outerClasses = joinClasses(
    'group relative min-h-0 text-left outline-none hover:z-50 focus:z-50',
    short ? 'mx-0.5 my-px' : 'm-0.5',
    `row-start-${rowStart} row-span-${rowSpan}`,
    overlaps ? laneClasses[lane] : laneClasses[0],
  )
  const face = <BlockFace block={block} short={short} dimmed={isPast} raised={overlaps && lane > 0} editable={!!session} />

  if (!session) {
    return (
      <div tabIndex={0} className={outerClasses}>
        {face}
      </div>
    )
  }
  return (
    <>
      <button type="button" onClick={() => setAdjusting(true)} className={joinClasses(outerClasses, 'cursor-pointer')}>
        {face}
      </button>
      <SessionDialog
        task={session.task}
        dates={dates}
        current={session.current}
        open={adjusting}
        onClose={() => setAdjusting(false)}
      />
    </>
  )
}

type BlockFaceProps = {
  block: PlannedBlock
  short: boolean
  dimmed: boolean
  raised: boolean
  editable: boolean
}

function BlockFace({ block, short, dimmed, raised, editable }: BlockFaceProps) {
  return (
    <span
      data-category={areaCategoryId(block.area)}
      className={joinClasses(
        'absolute inset-x-0 top-0 flex h-full flex-col gap-0.5 overflow-hidden rounded-control bg-hue px-2 text-on-hue',
        short ? 'justify-center py-0' : 'py-1',
        expandedFaceClasses,
        dimmed && 'opacity-50',
        raised && 'ring-2 ring-surface',
      )}
    >
      <span className={joinClasses('truncate type-meta font-bold group-hover:whitespace-normal group-focus:whitespace-normal', short && 'leading-tight')}>
        {block.title}
      </span>
      <span className="hidden type-meta tabular-nums group-hover:block group-focus:block">{blockTimeLabel(block)}</span>
      {block.adjusted && <span className="hidden type-meta opacity-80 group-hover:block group-focus:block">Ajustado neste dia</span>}
      <span className="sr-only">{`${block.area}, ${blockTimeLabel(block)}${editable ? '. Mudar' : ''}`}</span>
    </span>
  )
}
