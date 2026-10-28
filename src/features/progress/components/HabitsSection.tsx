import { useMemo } from 'react'
import { areaCategoryColors, areaCategoryId } from '@/shared/theme/areaColors'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import type { Habit } from '../api/progressTypes'
import { habitProgressText } from '../habitSummary'
import { HabitWeekDot } from './HabitWeekDot'

export type HabitsSectionProps = {
  habits: Habit[]
  ongoingWeek?: string
}

export function HabitsSection({ habits, ongoingWeek }: HabitsSectionProps) {
  const categories = useMemo(() => areaCategoryColors(habits.map((habit) => habit.area)), [habits])
  useCategoryColors(categories)

  if (habits.length === 0) return null

  return (
    <section aria-labelledby="habits-title" className="flex flex-col gap-3">
      <div>
        <h2 id="habits-title" className="type-section">
          Hábitos
        </h2>
        <p className="type-meta text-ink-muted">
          As últimas semanas das tarefas recorrentes. Ponto cheio: meta da semana cumprida. Anel: semana em andamento.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {habits.map((habit) => (
          <HabitRow key={habit.taskId} habit={habit} ongoingWeek={ongoingWeek} />
        ))}
      </ul>
    </section>
  )
}

type HabitRowProps = {
  habit: Habit
  ongoingWeek?: string
}

function HabitRow({ habit, ongoingWeek }: HabitRowProps) {
  const weeks = [...(habit.weeks ?? [])].sort((a, b) => a.start.localeCompare(b.start))
  const progress = habitProgressText(habit.streak, weeks.find((week) => week.start === ongoingWeek))

  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span data-category={areaCategoryId(habit.area)} aria-hidden="true" className="mt-1.5 size-3 shrink-0 rounded-full bg-hue-line" />
        <div>
          <p className="type-label">{habit.title}</p>
          <p className="type-meta text-ink-muted">
            {habit.area} · {habit.timesPerWeek}x por semana · {progress}
          </p>
        </div>
      </div>
      <ol aria-label="Semanas" className="flex gap-1.5">
        {weeks.map((week) => (
          <li key={week.start}>
            <HabitWeekDot week={week} ongoing={week.start === ongoingWeek} />
          </li>
        ))}
      </ol>
    </li>
  )
}
