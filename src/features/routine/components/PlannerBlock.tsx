import { Lock } from 'lucide-react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import { blockMinutes, blockTimeLabel } from '../blockTime'
import type { PlacedBlock } from '../weekGrid'

const laneClasses = ['col-span-full z-10', 'col-start-2 col-span-7 z-20', 'col-start-3 col-span-6 z-30', 'col-start-4 col-span-5 z-40']

export type PlannerBlockProps = {
  placed: PlacedBlock
}

// Abaixo disso, o bloco não tem altura para duas linhas: título e horário dividem uma linha só.
const compactMinutes = 75

// Com o mouse em cima ou com foco (toque, Tab), o bloco cresce para baixo por cima da grade e mostra o texto inteiro,
// sem mover o layout. A borda na cor da grade separa o bloco aberto do que ficou embaixo.
const expandedClasses =
  'group-hover:h-auto group-hover:min-h-full group-hover:ring-2 group-hover:ring-calendar group-focus:h-auto group-focus:min-h-full group-focus:ring-2 group-focus:ring-calendar group-focus-visible:outline-2 group-focus-visible:outline-accent'

export function PlannerBlock({ placed }: PlannerBlockProps) {
  const { block, rowStart, rowSpan, lane, overlaps } = placed
  const minutes = blockMinutes(block)
  const compact = minutes < compactMinutes

  return (
    <div
      tabIndex={0}
      className={joinClasses(
        'group relative m-0.5 min-h-0 outline-none hover:z-50 focus:z-50',
        `row-start-${rowStart} row-span-${rowSpan}`,
        overlaps ? laneClasses[lane] : laneClasses[0],
      )}
    >
      <div
        data-category={areaCategoryId(block.area)}
        className={joinClasses(
          'absolute inset-x-0 top-0 flex h-full overflow-hidden rounded-control border-l-4 border-hue-line bg-hue px-2 text-on-hue',
          expandedClasses,
          compact ? 'items-start gap-1.5 py-0.5' : 'flex-col gap-0.5 py-1',
          overlaps && lane > 0 && 'ring-2 ring-calendar',
        )}
      >
        {compact ? <CompactContent title={block.title} time={block.continuesFromPreviousDay ? block.end : block.start} /> : <FullContent placed={placed} />}
        <span className="sr-only">{`${block.area}, ${blockTimeLabel(block)}, horário fixo`}</span>
      </div>
    </div>
  )
}

type CompactContentProps = {
  title: string
  time: string
}

function CompactContent({ title, time }: CompactContentProps) {
  return (
    <p className="min-w-0 truncate type-meta group-hover:whitespace-normal group-focus:whitespace-normal">
      <span className="font-bold">{title}</span> <span className="tabular-nums">{time}</span>
    </p>
  )
}

type FullContentProps = {
  placed: PlacedBlock
}

function FullContent({ placed }: FullContentProps) {
  const { block } = placed
  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <p className="line-clamp-2 type-meta font-bold group-hover:line-clamp-none group-focus:line-clamp-none">{block.title}</p>
        <Lock aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
      </div>
      <p className="truncate type-meta tabular-nums group-hover:whitespace-normal group-focus:whitespace-normal">{blockTimeLabel(block)}</p>
      {blockMinutes(block) >= 90 && block.adjusted && <p className="truncate type-meta opacity-80">Ajustado nesta semana</p>}
    </>
  )
}
