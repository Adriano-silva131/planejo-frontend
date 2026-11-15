import { CalendarPlus } from 'lucide-react'
import { useState } from 'react'
import { SessionDialog } from '@/features/routine/components/SessionDialog'
import { startTaskDrag } from '@/shared/planning/taskDrag'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { Button } from '@/shared/ui/Button'
import { joinClasses } from '@/shared/ui/joinClasses'
import { toFitHint, toFitTitle, type ToFitContext, type ToFitItem } from './toFitItems'
import { useToFitItems } from './useToFitItems'

export type ToFitCardProps = {
  context: ToFitContext
  // Só o que dá para encaixar neste dia: hoje no Meu dia, ou o dia aberto na Semana.
  day?: string
}

export function ToFitCard({ context, day }: ToFitCardProps) {
  const { items, hasGrid } = useToFitItems(context, day)
  if (!items || (items.length === 0 && !day)) return null
  // A grade da Semana só aparece em tela larga e com algo marcado; sem ela, encaixa-se pelo diálogo.
  const draggable = context === 'week' && hasGrid
  const hint = toFitHint(day, draggable)
  const title = toFitTitle(context, day)

  return (
    <section aria-labelledby="to-fit-title" className="flex flex-col gap-4 rounded-card bg-surface p-5">
      <div>
        <h2 id="to-fit-title" className="type-label">
          {title}
        </h2>
        {items.length > 0 && (
          <p className="type-meta text-ink-muted">
            <span className="hidden lg:inline">{hint.wide}</span>
            <span className="lg:hidden">{hint.narrow}</span>
          </p>
        )}
      </div>
      {items.length === 0 ? (
        <p className="type-meta text-ink-muted">{`${title.replace('Para encaixar', 'Nada falta encaixar')}.`}</p>
      ) : (
        // A lista rola por dentro para o card não passar da altura da grade; o foco permite rolar pelo teclado.
        <ul
          tabIndex={0}
          aria-labelledby="to-fit-title"
          className="-mr-2 flex max-h-96 flex-col gap-2 overflow-y-auto overscroll-contain pr-2 focus-visible:outline-2 focus-visible:outline-action"
        >
          {items.map((item) => (
            <ToFitRow key={item.task.taskId} item={item} draggable={draggable} />
          ))}
        </ul>
      )}
    </section>
  )
}

type ToFitRowProps = {
  item: ToFitItem
  draggable: boolean
}

function ToFitRow({ item, draggable }: ToFitRowProps) {
  const [placing, setPlacing] = useState(false)
  const canPlace = item.dates.length > 0

  return (
    <li
      draggable={draggable && canPlace}
      onDragStart={draggable && canPlace ? (event) => startTaskDrag(event, { taskId: item.task.taskId, minutes: item.minutes, dates: item.dates }) : undefined}
      data-category={areaCategoryId(item.area)}
      className={joinClasses('flex items-center gap-3 rounded-control bg-surface-alt py-1 pl-3', draggable && canPlace && 'cursor-grab')}
    >
      <span aria-hidden="true" className="w-1 self-stretch rounded-full bg-hue-line" />
      <div className="min-w-0 flex-1 py-2">
        <p className="truncate type-label">{item.task.title}</p>
        <p className="truncate type-meta text-ink-muted">{item.detail}</p>
      </div>
      <span
        className={joinClasses(
          'shrink-0 type-meta tabular-nums',
          item.urgent ? 'rounded-control bg-peach px-2 py-0.5 font-bold text-on-peach' : 'text-ink-muted',
        )}
      >
        {item.badge}
      </span>
      {canPlace ? (
        <>
          <Button variant="ghost" size="icon" aria-label={`Encaixar ${item.task.title}`} onClick={() => setPlacing(true)}>
            <CalendarPlus aria-hidden="true" className="size-5" />
          </Button>
          <SessionDialog task={item.task} dates={item.dates} open={placing} onClose={() => setPlacing(false)} />
        </>
      ) : (
        <span className="w-3 shrink-0" />
      )}
    </li>
  )
}
