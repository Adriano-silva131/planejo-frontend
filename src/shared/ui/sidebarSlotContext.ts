import { createContext } from 'react'

// Elemento da navegação lateral onde cada tela coloca seu título e textos de apoio.
export const SidebarSlotContext = createContext<HTMLElement | null>(null)
