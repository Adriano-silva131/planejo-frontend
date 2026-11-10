import { useEffect, useRef } from 'react'
import { openDayTitleId } from '../weekColumns'

// Ao abrir um dia, o foco vai para o título dele; ao fechar, volta para o botão que abre aquele dia. Na primeira
// montagem (dia vindo da URL) o foco fica onde está.
export function useOpenDayFocus(openDate: string | undefined) {
  const previous = useRef(openDate)

  useEffect(() => {
    const closed = previous.current
    previous.current = openDate
    if (closed === openDate) return
    if (openDate) document.getElementById(openDayTitleId(openDate))?.focus()
    else if (closed) document.querySelector<HTMLElement>(`[data-day-toggle="${closed}"]`)?.focus()
  }, [openDate])
}
