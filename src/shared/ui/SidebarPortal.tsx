import { useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { SidebarSlotContext } from './sidebarSlotContext'

export type SidebarPortalProps = {
  children: ReactNode
}

export function SidebarPortal({ children }: SidebarPortalProps) {
  const slot = useContext(SidebarSlotContext)
  return slot ? createPortal(children, slot) : null
}
