import { CalendarPlus } from 'lucide-react'
import { useState } from 'react'
import { useWeekProgress } from '@/features/progress/api/progressQueries'
import type { PlannedDay } from '@/features/routine/api/routineTypes'
import { useWeekRoutine } from '@/features/routine/api/useWeekRoutine'
import { SessionDialog } from '@/features/routine/components/SessionDialog'
import { useTasks } from '@/features/tasks/api/taskQueries'
import { startTaskDrag } from '@/shared/planning/taskDrag'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { useWeekParam } from '@/shared/time/useWeekParam'
import { addDays } from '@/shared/time/week'
import { Button } from '@/shared/ui/Button'
import { joinClasses } from '@/shared/ui/joinClasses'
import { toFitItems, type ToFitItem } from './toFitItems'

export type ToFitCardProps = {
  // Só o que dá para encaixar neste dia, como no Meu dia.
  day?: string
}

export function ToFitCard({ day }: ToFitCardProps) {
  const { items, hasGrid } = useToFitItems(day)
  if (!items || items.length === 0) return null
  // A grade da Semana só aparece em tela larga e com algo marcado; sem ela, encaixa-se pelo diálogo.
  const draggable = !day && hasGrid

  return (
    <section aria-labelledby="to-fit-title" className="flex flex-col gap-4 rounded-card bg-surface p-5">
      <div>
        <h2 id="to-fit-title" className="type-label">
          {day ? 'Para encaixar hoje' : 'Para encaixar'}
        </h2>
        <p className="type-meta text-ink-muted">
          {draggable ? (
            <>
              <span className="hidden lg:inline">Arraste para a grade ou escolha o dia e o horário.</span>
              <span className="lg:hidden">Escolha o dia e o horário de cada uma.</span>
            </>
          ) : (
            `Escolha ${day ? 'o horário' : 'o dia e o horário'} de cada uma.`
          )}
        </p>
      </div>
      {/* A lista rola por dentro para o card não passar da altura da grade; o foco permite rolar pelo teclado. */}
      <ul
        tabIndex={0}
        aria-labelledby="to-fit-title"
        className="-mr-2 flex max-h-96 flex-col gap-2 overflow-y-auto overscroll-contain pr-2 focus-visible:outline-2 focus-visible:outline-action"
      >
        {items.map((item) => (
          <ToFitRow key={item.task.taskId} item={item} draggable={draggable} />
        ))}
      </ul>
    </section>
  )
}

// Itens undefined enquanto carrega ou quando a semana já passou.
function useToFitItems(day: string | undefined): { items?: ToFitItem[]; hasGrid: boolean } {
  const now = useNow()
  const today = toIsoDate(now)
  const week = useWeekParam(now)
  const weekIso = day ?? week.iso
  const progress = useWeekProgress(weekIso)
  const tasks = useTasks(1)
  const routine = useWeekRoutine(weekIso)

  const weekIsOver = !day && toIsoDate(addDays(week.start, 6)) < today
  if (weekIsOver || !progress.isSuccess || !tasks.isSuccess || !routine.isSuccess) return { hasGrid: false }
  const days = (routine.data.days ?? []) as PlannedDay[]
  const items = toFitItems(progress.data, tasks.data.data ?? [], days, today)
  const hasGrid = days.some((planned) => (planned.blocks ?? []).length > 0)
  if (!day) return { items, hasGrid }
  return { items: items.flatMap((item) => (item.dates.includes(day) ? [{ ...item, dates: [day] }] : [])), hasGrid }
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
      onDragStart={draggable && canPlace ? (event) => startTaskDrag(event, { taskId: item.task.taskId, minutes: item.minutes }) : undefined}
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
