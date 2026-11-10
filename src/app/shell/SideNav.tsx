import { NavLink } from 'react-router'
import { FreeTodayCard } from '@/features/routine/components/FreeTodayCard'
import { UserMenu } from '@/shared/auth/UserMenu'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { joinClasses } from '@/shared/ui/joinClasses'
import { Logo } from '@/shared/ui/Logo'
import { overviewNavItem, primaryNavItems, type NavItem } from './navItems'

export type SideNavProps = {
  slotRef: (element: HTMLDivElement | null) => void
}

export function SideNav({ slotRef }: SideNavProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-8 overflow-y-auto border-r border-line bg-surface px-3 py-6 lg:flex">
      <Logo className="px-3" />
      <nav aria-label="Principal">
        <ul className="flex flex-col gap-1">
          {[...primaryNavItems, overviewNavItem].map((item) => (
            <SideNavLink key={item.to} item={item} />
          ))}
        </ul>
      </nav>
      <div ref={slotRef} className="flex flex-col gap-6 border-t border-line px-3 pt-6 empty:hidden" />
      <div className="mt-auto flex flex-col gap-4">
        <FreeTodayCard />
        <div className="flex items-center gap-1">
          <UserMenu placement="sidebar" />
          <ThemeToggle />
        </div>
      </div>
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
            'flex min-h-10 items-center gap-3 rounded-control px-3 type-control',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action',
            isActive ? 'bg-surface-alt text-ink' : 'text-ink-muted hover:bg-surface-alt hover:text-ink',
          )
        }
      >
        <Icon aria-hidden="true" className="size-4" />
        {item.label}
      </NavLink>
    </li>
  )
}
