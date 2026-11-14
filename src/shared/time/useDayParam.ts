import { useSearchParams } from 'react-router'
import { dateInWeek } from './week'

// Dia escolhido dentro da semana mostrada (?dia=): o dia aberto na Semana, ou o dia da lista no celular. clear: o que
// deixa de valer ao fechar o dia, no mesmo setParams.
export function useDayParam(weekStart: Date, name = 'dia', clear: string[] = []) {
  const [params, setParams] = useSearchParams()
  const date = dateInWeek(params.get(name), weekStart)

  const update = (value: string | undefined) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(name, value)
        else for (const key of [name, ...clear]) next.delete(key)
        return next
      },
      { replace: true },
    )

  return { date, open: (value: string) => update(value), close: () => update(undefined) }
}
