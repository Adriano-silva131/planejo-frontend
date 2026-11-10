import { LogOut } from 'lucide-react'
import { useId, useRef } from 'react'
import { Link } from 'react-router'
import { joinClasses } from '@/shared/ui/joinClasses'
import { sessionProfile, type SessionProfile } from './sessionProfile'
import { useSession } from './useSession'
import { useSignOut } from './useSignOut'

export type UserMenuPlacement = 'header' | 'sidebar'

export type UserMenuProps = {
  placement?: UserMenuPlacement
}

const itemClasses =
  'flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left type-control text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-action'

const triggerClasses = {
  header: 'size-11 justify-center rounded-full',
  sidebar: 'min-h-11 min-w-0 flex-1 gap-3 rounded-control px-2 hover:bg-surface-alt',
} satisfies Record<UserMenuPlacement, string>

const menuClasses = {
  header: 'menu-below-end mt-2',
  sidebar: 'menu-above-start mb-2',
} satisfies Record<UserMenuPlacement, string>

export function UserMenu({ placement = 'header' }: UserMenuProps) {
  const session = useSession()
  const signOut = useSignOut()
  const menuId = useId()
  const menu = useRef<HTMLDivElement>(null)

  if (session.status !== 'signedIn') return null
  const profile = sessionProfile(session.session)
  const close = () => menu.current?.hidePopover()

  return (
    <>
      <button
        type="button"
        popoverTarget={menuId}
        aria-label={`Menu da conta de ${profile.name}`}
        className={joinClasses(
          'menu-anchor flex shrink-0 cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action',
          triggerClasses[placement],
        )}
      >
        <Avatar profile={profile} className={placement === 'header' ? 'size-11' : 'size-8'} />
        {placement === 'sidebar' && <span className="truncate type-control text-ink">{profile.name}</span>}
      </button>
      <div
        id={menuId}
        ref={menu}
        popover="auto"
        className={joinClasses('inset-auto m-0 w-64 rounded-card border border-line bg-surface p-2 text-ink', menuClasses[placement])}
      >
        <div className="border-b border-line px-3 pt-2 pb-3">
          <p className="type-label">{profile.name}</p>
          <p className="truncate type-meta text-ink-muted">{profile.email}</p>
        </div>
        <nav aria-label="Conta" className="flex flex-col pt-2">
          {placement === 'header' && (
            <Link to="/visao-geral" onClick={close} className={itemClasses}>
              Visão geral
            </Link>
          )}
          <Link to="/ajustes" onClick={close} className={itemClasses}>
            Ajustes
          </Link>
          <button type="button" onClick={() => void signOut()} className={itemClasses}>
            <LogOut aria-hidden="true" className="size-4" />
            Sair
          </button>
        </nav>
      </div>
    </>
  )
}

type AvatarProps = {
  profile: SessionProfile
  className: string
}

function Avatar({ profile, className }: AvatarProps) {
  return (
    <span
      className={joinClasses(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-peach type-label text-on-peach',
        className,
      )}
    >
      {profile.avatarUrl ? (
        <img src={profile.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
      ) : (
        profile.name.charAt(0).toUpperCase()
      )}
    </span>
  )
}
