import { useSearchParams } from 'react-router'

// O dia aberto na Semana, por períodos (padrão) ou na grade de horários (?ver=horarios).
export type DayView = 'periods' | 'hours'

export const dayViewParam = 'ver'

export function useDayView() {
  const [params, setParams] = useSearchParams()
  const view: DayView = params.get(dayViewParam) === 'horarios' ? 'hours' : 'periods'

  const setView = (next: DayView) =>
    setParams(
      (current) => {
        const params = new URLSearchParams(current)
        if (next === 'hours') params.set(dayViewParam, 'horarios')
        else params.delete(dayViewParam)
        return params
      },
      { replace: true },
    )

  return { view, setView }
}
