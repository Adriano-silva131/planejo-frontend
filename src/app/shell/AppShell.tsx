import { useState } from 'react'
import { Outlet } from 'react-router'
import { useAreaColorStyles } from '@/features/tasks/hooks/useAreaColorStyles'
import { SidebarSlotContext } from '@/shared/ui/sidebarSlotContext'
import { BottomNav } from './BottomNav'
import { SideNav } from './SideNav'

export function AppShell() {
  const [sidebarSlot, setSidebarSlot] = useState<HTMLElement | null>(null)
  useAreaColorStyles()

  return (
    <SidebarSlotContext value={sidebarSlot}>
      <div className="min-h-screen lg:flex">
        <SideNav slotRef={setSidebarSlot} />
        <main className="min-w-0 flex-1 px-4 pt-6 pb-28 md:px-8 lg:py-6">
          <div className="max-w-6xl 3xl:max-w-8xl">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </SidebarSlotContext>
  )
}
