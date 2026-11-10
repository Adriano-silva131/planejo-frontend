import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedBlock } from '../api/routineTypes'
import { expandedFaceClasses, extrasLabel, type BlockSize } from '../blockFace'
import { blockTimeLabel } from '../blockTime'

export type BlockFaceProps = {
  block: PlannedBlock
  // Blocos que entraram na etiqueta deste, na visão geral.
  extras: PlannedBlock[]
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
  tiny: 'hidden leading-tight group-hover:flex group-focus:flex',
  short: 'leading-tight',
  regular: '',
}

const openOnly = 'hidden group-hover:block group-focus:block'
const closedOnly = 'group-hover:hidden group-focus:hidden'

export function BlockFace({ block, extras, size, dimmed, raised, editable }: BlockFaceProps) {
  const hasExtras = extras.length > 0
  return (
    <span
      data-category={areaCategoryId(block.area)}
      className={joinClasses(
        'absolute inset-x-0 top-0 flex h-full flex-col gap-0.5 overflow-hidden rounded-control bg-hue px-2 text-on-hue',
        faceSizeClasses[size],
        block.taskKind === 'fixed' && 'fixed-hatch',
        expandedFaceClasses,
        dimmed && 'opacity-50',
        raised && 'ring-2 ring-surface',
      )}
    >
      <span aria-hidden="true" className={joinClasses('flex min-w-0 items-baseline gap-1 type-meta font-bold', titleSizeClasses[size])}>
        <span className="truncate group-hover:whitespace-normal group-focus:whitespace-normal">{block.title}</span>
        {hasExtras && size !== 'regular' && <span className={joinClasses('shrink-0 opacity-80', closedOnly)}>{`+${extras.length}`}</span>}
      </span>
      {hasExtras && size === 'regular' && <span aria-hidden="true" className={joinClasses('truncate type-meta opacity-80', closedOnly)}>{extrasLabel(extras)}</span>}
      <span aria-hidden="true" className={joinClasses('type-meta tabular-nums', openOnly)}>{blockTimeLabel(block)}</span>
      {block.adjusted && <span aria-hidden="true" className={joinClasses('type-meta opacity-80', openOnly)}>Ajustado neste dia</span>}
      {extras.map((extra) => (
        <span key={`${extra.taskId}-${extra.start}`} aria-hidden="true" className={joinClasses('type-meta', openOnly)}>
          {`+ ${extra.title} · ${blockTimeLabel(extra)}`}
        </span>
      ))}
      <span className="sr-only">{accessibleLabel(block, extras, editable)}</span>
    </span>
  )
}

function accessibleLabel(block: PlannedBlock, extras: PlannedBlock[], editable: boolean) {
  const fixed = block.taskKind === 'fixed' ? ', horário fixo' : ''
  const also = extras.length > 0 ? `; também ${extras.map((extra) => `${extra.title}, ${blockTimeLabel(extra)}`).join('; ')}` : ''
  return `${block.title}, ${block.area}, ${blockTimeLabel(block)}${fixed}${also}${editable ? '. Mudar' : ''}`
}
