import { Check } from 'lucide-react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { toIsoDate } from '@/shared/time/calendarDate'
import { useNow } from '@/shared/time/useNow'
import { SegmentMeter } from '@/shared/ui/SegmentMeter'
import { useHabits } from '../api/progressQueries'
import { weekRhythm, type RhythmRow } from '../weekRhythm'

export function WeekRhythmCard() {
  const habits = useHabits(toIsoDate(useNow()))

  if (habits.isPending) return null
  const rows = habits.isSuccess ? weekRhythm(habits.data) : []
  if (habits.isSuccess && rows.length === 0) return null
  const met = rows.filter((row) => row.met).length

  return (
    <section aria-labelledby="rhythm-title" className="flex flex-col gap-3 rounded-card bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="rhythm-title" className="type-label">
          Ritmo da semana
        </h2>
        {habits.isSuccess && <p className="type-meta text-ink-muted">{`${met} de ${rows.length} em dia`}</p>}
      </div>
      {habits.isError ? (
        <p className="type-meta text-ink-muted">Não deu para carregar o ritmo agora.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <RhythmItem key={row.taskId} row={row} />
          ))}
        </ul>
      )}
    </section>
  )
}

type RhythmItemProps = {
  row: RhythmRow
}

function RhythmItem({ row }: RhythmItemProps) {
  return (
    <li data-category={areaCategoryId(row.area)} className="flex items-center gap-3 type-meta">
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
      <span className="min-w-0 flex-1 truncate">{row.title}</span>
      <div className="w-24 shrink-0">
        <SegmentMeter filled={row.done} total={row.target} label={`${row.done} de ${row.target} nesta semana`} />
      </div>
      <span className="flex w-8 shrink-0 justify-end tabular-nums text-ink-muted">
        {row.met ? <Check role="img" aria-label="Meta cumprida" className="size-4 text-action" /> : `${row.done}/${row.target}`}
      </span>
    </li>
  )
}
