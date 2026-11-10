import { useState } from 'react'
import { usePlaceSession, type SessionTarget, type SessionTimes } from '../api/useSessionActions'
import { sessionErrorMessage } from '../sessionForm'

export type PlacementAlert = {
  message: string
  // Dia do encaixe recusado: o aviso só aparece enquanto esse dia está na tela.
  date: string
}

export type PlaceInput = SessionTarget & SessionTimes

// Encaixe por arrasto na grade inteira: um só pedido por vez e um aviso visível quando a API recusa.
export function useGridPlacement() {
  const placeSession = usePlaceSession()
  const [alert, setAlert] = useState<PlacementAlert>()

  const place = (input: PlaceInput) => {
    setAlert(undefined)
    placeSession.mutate(input, {
      onError: (error) => setAlert({ message: sessionErrorMessage(error, 'Não deu para encaixar a atividade. Tente de novo.'), date: input.date }),
    })
  }

  return {
    place,
    alert,
    dismiss: () => setAlert(undefined),
    pendingDate: placeSession.isPending ? placeSession.variables.date : undefined,
  }
}
