import type { ReactNode } from 'react'
import { UserMenu } from '@/shared/auth/UserMenu'
import { SidebarPortal } from './SidebarPortal'

export type PageHeaderProps = {
  title: string
  eyebrow?: string
  description?: string
  back?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

// No computador, título e textos vão para a navegação lateral e a página começa por uma linha de ações.
export function PageHeader({ title, eyebrow, description, back, actions, children }: PageHeaderProps) {
  return (
    <>
      <SidebarPortal>
        <div className="flex flex-col gap-2">
          {eyebrow && <p className="type-eyebrow text-ink-muted">{eyebrow}</p>}
          <h1 className="type-section">{title}</h1>
          {description && <p className="type-meta text-ink-muted">{description}</p>}
        </div>
      </SidebarPortal>
      <header className="flex flex-col gap-4">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {back}
            {!back && eyebrow && <p className="type-eyebrow text-ink-muted lg:hidden">{eyebrow}</p>}
            {children && <div className="hidden lg:block">{children}</div>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <UserMenu />
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:hidden">
          <h1 className="type-title">{title}</h1>
          {description && <p className="text-ink-muted">{description}</p>}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </header>
    </>
  )
}
