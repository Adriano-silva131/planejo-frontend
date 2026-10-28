import { useState } from 'react'
import { Outlet } from 'react-router'
import { SidebarSlotContext } from '@/shared/ui/sidebarSlotContext'
import { BottomNav } from './BottomNav'
import { SideNav } from './SideNav'

export function AppShell() {
  const [sidebarSlot, setSidebarSlot] = useState<HTMLElement | null>(null)

  return (
    <SidebarSlotContext value={sidebarSlot}>
      <div className="min-h-screen lg:flex">
        <SideNav slotRef={setSidebarSlot} />
        <main className="min-w-0 flex-1 px-4 pt-6 pb-28 md:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </SidebarSlotContext>
  )
}
