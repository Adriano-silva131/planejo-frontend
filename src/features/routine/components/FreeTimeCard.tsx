import { Sun } from 'lucide-react'
import { formatDuration } from '@/shared/time/timeOfDay'
import { joinClasses } from '@/shared/ui/joinClasses'

export type FreeTimeCardProps = {
  freeMinutes: number
  className?: string
}

export function FreeTimeCard({ freeMinutes, className }: FreeTimeCardProps) {
  return (
    <section
      aria-labelledby="free-time-title"
      className={joinClasses('flex flex-col gap-3 rounded-card bg-peach p-5 text-on-peach md:p-6', className)}
    >
      <Sun aria-hidden="true" className="size-6" />
      <h2 id="free-time-title" className="type-section">
        Um respiro no plano.
      </h2>
      <p>
        {freeMinutes > 0
          ? `Sobram ${formatDuration(freeMinutes)} sem compromisso até o fim do dia.`
          : 'Hoje está cheio. Se algo sair do plano, tudo bem.'}
      </p>
    </section>
  )
}
