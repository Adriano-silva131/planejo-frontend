import { Lock } from 'lucide-react'
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
  line: 'justify-center py-0',
  stacked: 'py-1.5',
}

const titleSizeClasses: Record<BlockSize, string> = {
  tiny: 'hidden leading-tight group-hover:flex group-focus:flex',
  short: 'leading-tight',
  regular: '',
  line: 'leading-tight',
  stacked: '',
}

// No dia aberto o horário fica sempre à vista: na mesma linha do título ou embaixo.
const timeShown: Partial<Record<BlockSize, 'inline' | 'below'>> = { line: 'inline', stacked: 'below' }

const openOnly = 'hidden group-hover:block group-focus:block'
const closedOnly = 'group-hover:hidden group-focus:hidden'

export function BlockFace({ block, extras, size, dimmed, raised, editable }: BlockFaceProps) {
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
      <TitleRow block={block} extras={extras} size={size} />
      <Details block={block} extras={extras} size={size} />
      <span className="sr-only">{accessibleLabel(block, extras, editable)}</span>
    </span>
  )
}

type FaceContentProps = Pick<BlockFaceProps, 'block' | 'extras' | 'size'>

function TitleRow({ block, extras, size }: FaceContentProps) {
  return (
    <span aria-hidden="true" className={joinClasses('flex min-w-0 items-baseline gap-1 type-meta font-bold', titleSizeClasses[size])}>
      {size === 'stacked' && block.taskKind === 'fixed' && <Lock className="size-3 shrink-0 self-center" />}
      <span className="truncate group-hover:whitespace-normal group-focus:whitespace-normal">{block.title}</span>
      {timeShown[size] === 'inline' && <span className="shrink-0 font-normal tabular-nums opacity-80">{`· ${blockTimeLabel(block)}`}</span>}
      {extras.length > 0 && size !== 'regular' && <span className={joinClasses('shrink-0 opacity-80', closedOnly)}>{`+${extras.length}`}</span>}
    </span>
  )
}

// Linhas abaixo do título: o resumo dos blocos juntos, o horário e, ao abrir, o resto dos detalhes.
function Details({ block, extras, size }: FaceContentProps) {
  const time = timeShown[size]
  return (
    <>
      {extras.length > 0 && size === 'regular' && <span aria-hidden="true" className={joinClasses('truncate type-meta opacity-80', closedOnly)}>{extrasLabel(extras)}</span>}
      {time !== 'inline' && (
        <span aria-hidden="true" className={joinClasses('truncate type-meta tabular-nums', time === 'below' ? 'opacity-80' : openOnly)}>
          {blockTimeLabel(block)}
        </span>
      )}
      {block.adjusted && <span aria-hidden="true" className={joinClasses('type-meta opacity-80', openOnly)}>Ajustado neste dia</span>}
      {extras.map((extra) => (
        <span key={`${extra.taskId}-${extra.start}`} aria-hidden="true" className={joinClasses('type-meta', openOnly)}>
          {`+ ${extra.title} · ${blockTimeLabel(extra)}`}
        </span>
      ))}
    </>
  )
}

function accessibleLabel(block: PlannedBlock, extras: PlannedBlock[], editable: boolean) {
  const fixed = block.taskKind === 'fixed' ? ', horário fixo' : ''
  const also = extras.length > 0 ? `; também ${extras.map((extra) => `${extra.title}, ${blockTimeLabel(extra)}`).join('; ')}` : ''
  return `${block.title}, ${block.area}, ${blockTimeLabel(block)}${fixed}${also}${editable ? '. Mudar' : ''}`
}
