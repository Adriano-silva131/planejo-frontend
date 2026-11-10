import { useState } from 'react'
import { joinClasses } from '@/shared/ui/joinClasses'
import { blockSize } from '../blockFace'
import { slotMinutes, type PlacedBlock } from '../weekGrid'
import { blockSession } from '../sessionForm'
import { BlockFace } from './BlockFace'
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
  // Etiqueta com outros blocos abre o dia, onde cada um aparece separado.
  onOpenDay: () => void
}

// Sessão encaixada é um botão que abre a mudança de horário; etiqueta com outros blocos abre o dia; bloco de fixa só
// mostra os detalhes.
export function PlannerBlock({ placed, date, dates, isPast, onOpenDay }: PlannerBlockProps) {
  const { block, rowStart, rowSpan, lane, layer, overlaps, side, extras } = placed
  const size = blockSize(rowSpan * slotMinutes)
  const [adjusting, setAdjusting] = useState(false)
  const session = extras.length === 0 ? blockSession(block, date) : undefined
  const outerClasses = joinClasses(
    'group relative min-h-0 text-left outline-none',
    size === 'regular' ? 'm-0.5' : 'mx-0.5 my-px',
    `row-start-${rowStart} row-span-${rowSpan}`,
    overlaps ? joinClasses(side ? sideClasses[side] : laneClasses[lane], layerClasses[layer]) : soloClasses,
  )
  const face = <BlockFace block={block} extras={extras} size={size} dimmed={isPast} raised={overlaps && layer > 0 && !side} editable={!!session} />

  if (extras.length > 0) {
    return (
      <button type="button" onClick={onOpenDay} className={joinClasses(outerClasses, 'cursor-pointer')}>
        {face}
      </button>
    )
  }
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
