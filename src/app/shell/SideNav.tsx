import { NavLink } from 'react-router'
import { joinClasses } from '@/shared/ui/joinClasses'
import { Logo } from '@/shared/ui/Logo'
import { overviewNavItem, primaryNavItems, settingsNavItem, type NavItem } from './navItems'

export type SideNavProps = {
  slotRef: (element: HTMLDivElement | null) => void
}

export function SideNav({ slotRef }: SideNavProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r border-line bg-nav px-4 py-8 lg:flex">
      <Logo className="px-3" />
      <nav aria-label="Principal">
        <ul className="flex flex-col gap-1">
          {[...primaryNavItems, overviewNavItem].map((item) => (
            <SideNavLink key={item.to} item={item} />
          ))}
        </ul>
      </nav>
      <div ref={slotRef} className="flex flex-col gap-6 border-t border-line px-3 pt-6 empty:hidden" />
      <nav aria-label="Configurações" className="mt-auto border-t border-line pt-4">
        <ul>
          <SideNavLink item={settingsNavItem} />
        </ul>
      </nav>
    </aside>
  )
}

type SideNavLinkProps = {
  item: NavItem
}

function SideNavLink({ item }: SideNavLinkProps) {
  const Icon = item.icon
  return (
    <li>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          joinClasses(
            'flex min-h-11 items-center gap-3 rounded-control px-3 type-control',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            isActive ? 'bg-action text-on-action' : 'text-ink hover:bg-ink/5',
          )
        }
      >
        <Icon aria-hidden="true" className="size-5" />
        {item.label}
      </NavLink>
    </li>
  )
}
