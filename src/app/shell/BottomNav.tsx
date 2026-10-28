import { NavLink } from 'react-router'
import { joinClasses } from '@/shared/ui/joinClasses'
import { primaryNavItems } from './navItems'

export function BottomNav() {
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface lg:hidden">
      <ul className="grid grid-cols-3">
        {primaryNavItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                joinClasses(
                  'flex min-h-16 flex-col items-center justify-center gap-1 type-meta',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
                  isActive ? 'font-bold text-accent' : 'text-ink-muted',
                )
              }
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
