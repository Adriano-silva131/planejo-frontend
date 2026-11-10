import { useSearchParams } from 'react-router'
import { fromIsoDate, toIsoDate } from './calendarDate'
import { addDays, startOfWeek } from './week'

const isoDate = /^\d{4}-\d{2}-\d{2}$/

// clear: parâmetros que deixam de valer ao trocar de semana, como o dia aberto. Vão no mesmo setParams, porque
// chamadas seguidas no mesmo tique se sobrescrevem.
export function useWeekParam(now: Date, name = 'semana', clear: string[] = []) {
  const [params, setParams] = useSearchParams()
  const raw = params.get(name)
  const start = startOfWeek(raw && isoDate.test(raw) ? fromIsoDate(raw) : now)

  const goTo = (date: Date) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set(name, toIsoDate(startOfWeek(date)))
        for (const key of clear) next.delete(key)
        return next
      },
      { replace: true },
    )

  return {
    start,
    iso: toIsoDate(start),
    previous: () => goTo(addDays(start, -7)),
    next: () => goTo(addDays(start, 7)),
    today: () => goTo(now),
  }
}
