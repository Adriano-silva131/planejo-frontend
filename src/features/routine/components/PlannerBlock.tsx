import { useState } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedBlock } from '../api/routineTypes'
import { blockSize, expandedFaceClasses, type BlockSize } from '../blockFace'
import { blockMinutes, blockTimeLabel } from '../blockTime'
import type { PlacedBlock } from '../weekGrid'
import { blockSession } from '../sessionForm'
import { SessionDialog } from './SessionDialog'

const laneClasses = ['col-span-full', 'col-start-2 col-span-7', 'col-start-3 col-span-6', 'col-start-4 col-span-5']
const sideClasses = { left: 'col-start-1 col-span-4', right: 'col-start-5 col-span-4' }

// Aberto, o bloco sobreposto sobe só até abaixo da camada seguinte, que continua clicável por cima dele.
// Nada passa de z-45: a linha de agora (z-50) e o cabeçalho fixo da grade ficam sempre por cima.
const layerClasses = ['z-10 hover:z-15 focus:z-15', 'z-20 hover:z-25 focus:z-25', 'z-30 hover:z-35 focus:z-35', 'z-40 hover:z-45 focus:z-45']
const soloClasses = 'col-span-full z-10 hover:z-45 focus:z-45'

export type PlannerBlockProps = {
  placed: PlacedBlock
  date: string
  // Dias para onde a sessão pode ir.
  dates: string[]
  isPast: boolean
}

// Sessão encaixada é um botão que abre a mudança de horário; bloco de fixa só mostra os detalhes.
export function PlannerBlock({ placed, date, dates, isPast }: PlannerBlockProps) {
  const { block, rowStart, rowSpan, lane, layer, overlaps, side } = placed
  const size = blockSize(blockMinutes(block))
  const [adjusting, setAdjusting] = useState(false)
  const session = blockSession(block, date)
  const outerClasses = joinClasses(
    'group relative min-h-0 text-left outline-none',
    size === 'regular' ? 'm-0.5' : 'mx-0.5 my-px',
    `row-start-${rowStart} row-span-${rowSpan}`,
    overlaps ? joinClasses(side ? sideClasses[side] : laneClasses[lane], layerClasses[layer]) : soloClasses,
  )
  const face = <BlockFace block={block} size={size} dimmed={isPast} raised={overlaps && layer > 0 && !side} editable={!!session} />

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
  size: BlockSize
  dimmed: boolean
  raised: boolean
  editable: boolean
}

const faceSizeClasses: Record<BlockSize, string> = {
  tiny: 'py-0 group-hover:py-1 group-focus:py-1',
  short: 'justify-center py-0',
  regular: 'py-1',
}

const titleSizeClasses: Record<BlockSize, string> = {
  tiny: 'hidden leading-tight group-hover:block group-focus:block',
  short: 'leading-tight',
  regular: '',
}

function BlockFace({ block, size, dimmed, raised, editable }: BlockFaceProps) {
  return (
    <span
      data-category={areaCategoryId(block.area)}
      className={joinClasses(
        'absolute inset-x-0 top-0 flex h-full flex-col gap-0.5 overflow-hidden rounded-control bg-hue px-2 text-on-hue',
        faceSizeClasses[size],
        expandedFaceClasses,
        dimmed && 'opacity-50',
        raised && 'ring-2 ring-surface',
      )}
    >
      <span className={joinClasses('truncate type-meta font-bold group-hover:whitespace-normal group-focus:whitespace-normal', titleSizeClasses[size])}>
        {block.title}
      </span>
      <span className="hidden type-meta tabular-nums group-hover:block group-focus:block">{blockTimeLabel(block)}</span>
      {block.adjusted && <span className="hidden type-meta opacity-80 group-hover:block group-focus:block">Ajustado neste dia</span>}
      <span className="sr-only">{`${size === 'tiny' ? `${block.title}, ` : ''}${block.area}, ${blockTimeLabel(block)}${editable ? '. Mudar' : ''}`}</span>
    </span>
  )
}
