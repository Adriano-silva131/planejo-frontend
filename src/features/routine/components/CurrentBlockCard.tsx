import { Lock } from 'lucide-react'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { RoutineBlock } from '../api/routineTypes'
import { blockTimeLabel } from '../blockTime'
import type { DayPlan } from '../dayPlan'

export type CurrentBlockCardProps = {
  plan: DayPlan
  hasBlocksToday: boolean
  className?: string
}

export function CurrentBlockCard({ plan, hasBlocksToday, className }: CurrentBlockCardProps) {
  return (
    <section
      aria-labelledby="current-block-title"
      className={joinClasses('flex flex-col items-start gap-3 rounded-card bg-brand p-5 text-on-brand md:p-6', className)}
    >
      {plan.highlight ? (
        <BlockHighlight block={plan.highlight.block} isNow={plan.highlight.isNow} />
      ) : (
        <FreeDay hasBlocksToday={hasBlocksToday} />
      )}
    </section>
  )
}

type BlockHighlightProps = {
  block: RoutineBlock
  isNow: boolean
}

function BlockHighlight({ block, isNow }: BlockHighlightProps) {
  return (
    <>
      <p className="type-eyebrow opacity-80">{isNow ? 'Agora' : 'A seguir'}</p>
      <h2 id="current-block-title" className="type-headline">
        {block.title}
      </h2>
      <p className="type-meta tabular-nums">
        {block.area} · {blockTimeLabel(block)}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-on-brand/15 px-3 py-1 type-meta">
        <Lock aria-hidden="true" className="size-3.5" />
        Horário fixo
      </p>
    </>
  )
}

type FreeDayProps = {
  hasBlocksToday: boolean
}

function FreeDay({ hasBlocksToday }: FreeDayProps) {
  return (
    <>
      <p className="type-eyebrow opacity-80">Agora</p>
      <h2 id="current-block-title" className="type-headline">
        {hasBlocksToday ? 'O resto do dia é seu.' : 'Seu dia está livre.'}
      </h2>
      <p>{hasBlocksToday ? 'Nada mais marcado para hoje.' : 'Cadastre uma tarefa fixa para ela aparecer aqui.'}</p>
      {!hasBlocksToday && (
        <ButtonLink to="/atividades/nova" variant="inverse" className="mt-2">
          Cadastrar atividade
        </ButtonLink>
      )}
    </>
  )
}
