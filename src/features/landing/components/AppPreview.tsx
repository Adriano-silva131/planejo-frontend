import { Lock, Sparkles } from 'lucide-react'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import { previewActivities, previewCategories } from '../previewDay'

type PartProps = {
  className?: string
}

const previewLabel =
  'Prévia do Planejo: agora é hora de focar no trabalho, a IA sugere um respiro no plano e a noite tem academia e estudo.'

export function AppPreview() {
  useCategoryColors(previewCategories)

  return (
    <div role="img" aria-label={previewLabel} className="grid gap-3 rounded-card border border-line bg-surface p-3 sm:grid-cols-5 sm:p-4">
      <NowCard className="sm:col-span-3" />
      <SuggestionCard className="sm:col-span-2" />
      <PreviewTimeline className="sm:col-span-5" />
    </div>
  )
}

function NowCard({ className }: PartProps) {
  return (
    <div className={joinClasses('flex flex-col gap-2 rounded-card bg-brand p-5 text-on-brand', className)}>
      <p className="type-eyebrow opacity-80">Agora</p>
      <p className="type-headline">Hora de focar.</p>
      <p className="type-meta tabular-nums">Trabalho · 09:00–18:00</p>
      <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-on-brand/15 px-3 py-1 type-meta">
        <Lock aria-hidden="true" className="size-3.5" />
        Horário fixo
      </p>
    </div>
  )
}

function SuggestionCard({ className }: PartProps) {
  return (
    <div className={joinClasses('flex flex-col gap-2 rounded-card bg-peach p-5 text-on-peach', className)}>
      <Sparkles aria-hidden="true" className="size-6" />
      <p className="type-section">Um respiro no plano.</p>
      <p className="type-meta">A noite ficou cheia. Que tal estudar mais cedo?</p>
    </div>
  )
}

function PreviewTimeline({ className }: PartProps) {
  return (
    <div className={joinClasses('flex flex-col gap-3 p-2', className)}>
      <p className="type-label">O resto do dia</p>
      <ul className="flex flex-col gap-2">
        {previewActivities.map((activity) => (
          <li key={activity.title} className="flex items-center gap-3">
            <span className="w-12 type-meta tabular-nums text-ink-muted">{activity.time}</span>
            <div
              data-category={activity.categoryId}
              className="flex-1 rounded-control border-l-4 border-hue-line bg-hue px-3 py-2 text-on-hue"
            >
              <p className="type-label">{activity.title}</p>
              <p className="type-meta">
                {activity.category} · {activity.duration}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
