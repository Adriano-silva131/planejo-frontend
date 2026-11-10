import type { ReactNode } from 'react'
import { UserMenu } from '@/shared/auth/UserMenu'
import { joinClasses } from './joinClasses'

export type PageHeaderProps = {
  title: ReactNode
  eyebrow?: string
  description?: string
  back?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

// No celular, ações e menu da conta ficam numa linha acima do título; no computador, as ações vão ao lado
// do título e o menu da conta fica na navegação lateral.
export function PageHeader({ title, eyebrow, description, back, actions, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className={joinClasses('flex min-h-11 flex-wrap items-center justify-between gap-3', !back && 'lg:hidden')}>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {back}
          {!back && eyebrow && <p className="type-eyebrow text-ink-muted">{eyebrow}</p>}
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          {actions}
          <UserMenu />
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          {!back && eyebrow && <p className="hidden type-eyebrow text-ink-muted lg:block">{eyebrow}</p>}
          <h1 className="type-title">{title}</h1>
          {description && <p className="text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="hidden shrink-0 items-center gap-3 lg:flex">{actions}</div>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </header>
  )
}
