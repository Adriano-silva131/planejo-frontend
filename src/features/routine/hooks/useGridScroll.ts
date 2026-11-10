import { useLayoutEffect, useRef } from 'react'

// Rola a grade até a hora pedida quando a chave muda (semana, dia aberto); a virada de hora não tira o usuário de
// onde ele está.
export function useGridScroll(hour: number, key: string | undefined) {
  const scroller = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const scrolledKey = useRef<string>(undefined)

  useLayoutEffect(() => {
    if (scrolledKey.current === key) return
    const target = scroller.current?.querySelector<HTMLElement>(`[data-hour="${hour}"]`)
    if (!scroller.current || !target) return
    scroller.current.scrollTop = target.offsetTop - (header.current?.offsetHeight ?? 0)
    scrolledKey.current = key
  }, [hour, key])

  return { scroller, header }
}
