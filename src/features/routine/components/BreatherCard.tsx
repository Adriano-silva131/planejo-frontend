import { Sun } from 'lucide-react'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import type { FreeGap } from '../dayItems'

export type BreatherCardProps = {
  gap?: FreeGap
  now: number
}

export function BreatherCard({ gap, now }: BreatherCardProps) {
  return (
    <section aria-labelledby="breather-title" className="flex flex-col gap-2 rounded-card bg-peach p-5 text-on-peach">
      <div className="flex items-center gap-2">
        <Sun aria-hidden="true" className="size-5 shrink-0" />
        <h2 id="breather-title" className="type-section">
          Um respiro no plano.
        </h2>
      </div>
      <p className="type-meta">{breatherText(now, gap)}</p>
    </section>
  )
}

function breatherText(now: number, gap?: FreeGap) {
  if (!gap) return 'Hoje está cheio. Se algo sair do plano, tudo bem.'
  return `${breatherWhen(now, gap)} não tem nada marcado. Uma pausa de verdade também conta.`
}

function breatherWhen(now: number, gap: FreeGap) {
  const startsNow = gap.start <= now
  if (gap.end >= minutesInDay) return startsNow ? 'Daqui até a noite' : `Depois das ${timeOfDayLabel(gap.start)}`
  if (startsNow) return `Até as ${timeOfDayLabel(gap.end)}`
  return `Entre ${timeOfDayLabel(gap.start)} e ${timeOfDayLabel(gap.end)}`
}
