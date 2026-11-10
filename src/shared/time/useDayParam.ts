import { useSearchParams } from 'react-router'
import { dateInWeek } from './week'

// Dia escolhido dentro da semana mostrada (?dia=): o dia aberto na grade, ou o dia da lista no celular.
export function useDayParam(weekStart: Date, name = 'dia') {
  const [params, setParams] = useSearchParams()
  const date = dateInWeek(params.get(name), weekStart)

  const update = (value: string | undefined) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(name, value)
        else next.delete(name)
        return next
      },
      { replace: true },
    )

  return { date, open: (value: string) => update(value), close: () => update(undefined) }
}
