import { fromIsoDate } from '@/shared/time/calendarDate'
import { thisWeekdayLabel } from '@/shared/time/dateLabels'
import type { PlannedBlock } from '../api/routineTypes'
import { useResetOccurrence } from '../api/useOccurrenceActions'
import { sessionErrorMessage } from '../sessionForm'

export type SkippedNoticeProps = {
  block: PlannedBlock
  date: string
  onUndone: () => void
}

// O fixo tirado do dia some da rotina; o aviso fica enquanto o dia está na tela, para dar para desfazer.
export function SkippedNotice({ block, date, onUndone }: SkippedNoticeProps) {
  const reset = useResetOccurrence()
  return (
    <div role="status" className="flex flex-col gap-1 rounded-control border border-dashed border-peach-ink/60 px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="type-meta">
          <strong>{block.title}</strong> não vai ter {thisWeekdayLabel(fromIsoDate(date))}.
        </p>
        <button
          type="button"
          disabled={reset.isPending}
          onClick={() => reset.mutate({ taskId: block.taskId, date }, { onSuccess: onUndone })}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-control px-2 type-meta font-semibold text-action hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-action disabled:opacity-50"
        >
          Desfazer
        </button>
      </div>
      {reset.error && (
        <p role="alert" className="type-meta text-danger">
          {sessionErrorMessage(reset.error, 'Não deu para desfazer agora. Tente de novo.')}
        </p>
      )}
    </div>
  )
}
