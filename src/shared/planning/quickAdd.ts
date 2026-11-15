import { createContext, useContext } from 'react'

// O que já se sabe ao abrir o Adicionar rápido, como o dia aberto na Semana.
export type QuickAddDraft = {
  date?: string
}

export type OpenQuickAdd = (draft?: QuickAddDraft) => void

// Qualquer tela abre o Adicionar rápido sem depender de quem o desenha (o shell do app).
export const QuickAddContext = createContext<OpenQuickAdd | undefined>(undefined)

export function useQuickAdd() {
  return useContext(QuickAddContext)
}
