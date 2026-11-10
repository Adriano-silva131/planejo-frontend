import { Lock } from 'lucide-react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { formatDuration, minutesOfDay } from '@/shared/time/timeOfDay'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import type { PlannedBlock } from '../api/routineTypes'
import { blockTimeLabel } from '../blockTime'
import type { DayPlan } from '../dayPlan'

export type NowCardProps = {
  plan: DayPlan
  now: number
  hasBlocksToday: boolean
}

export function NowCard({ plan, now, hasBlocksToday }: NowCardProps) {
  return (
    <section aria-labelledby="now-card-title" className="flex flex-col gap-4 rounded-card bg-highlight p-5 text-ink md:p-6">
      {plan.highlight ? (
        <BlockHighlight block={plan.highlight.block} isNow={plan.highlight.isNow} now={now} />
      ) : (
        <FreeDay hasBlocksToday={hasBlocksToday} />
      )}
    </section>
  )
}

type BlockHighlightProps = {
  block: PlannedBlock
  isNow: boolean
  now: number
}

function BlockHighlight({ block, isNow, now }: BlockHighlightProps) {
  const start = minutesOfDay(block.start)
  const end = minutesOfDay(block.end)
  const eyebrow = isNow ? `Agora · faltam ${formatDuration(end - now)}` : `A seguir · em ${formatDuration(start - now)}`

  return (
    <div data-category={areaCategoryId(block.area)} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="type-eyebrow text-action">{eyebrow}</p>
        {(block.taskKind ?? 'fixed') === 'fixed' && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-canvas/40 px-3 py-1 type-meta">
            <Lock aria-hidden="true" className="size-3.5" />
            Horário fixo
          </p>
        )}
      </div>
      <div>
        <h2 id="now-card-title" className="type-headline">
          {block.title}
        </h2>
        <p className="type-meta tabular-nums text-ink-muted">
          {block.area} · {blockTimeLabel(block)}
        </p>
      </div>
      {isNow && (
        <ProgressBar tone="category" value={now - start} max={end - start} label={`${formatDuration(now - start)} de ${formatDuration(end - start)}`} />
      )}
    </div>
  )
}

type FreeDayProps = {
  hasBlocksToday: boolean
}

function FreeDay({ hasBlocksToday }: FreeDayProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="type-eyebrow text-action">Agora</p>
      <h2 id="now-card-title" className="type-headline">
        {hasBlocksToday ? 'O resto do dia é seu.' : 'Seu dia está livre.'}
      </h2>
      <p className="text-ink-muted">
        {hasBlocksToday ? 'Nada mais marcado para hoje.' : 'Cadastre uma tarefa fixa para ela aparecer aqui.'}
      </p>
      {!hasBlocksToday && (
        <ButtonLink to="/atividades?atividade=nova" className="mt-1">
          Cadastrar atividade
        </ButtonLink>
      )}
    </div>
  )
}
