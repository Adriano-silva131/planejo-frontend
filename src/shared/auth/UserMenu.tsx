import { LogOut } from 'lucide-react'
import { useId, useRef } from 'react'
import { Link } from 'react-router'
import { sessionProfile } from './sessionProfile'
import { useSession } from './useSession'
import { useSignOut } from './useSignOut'

const itemClasses =
  'flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left type-control text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent'

export function UserMenu() {
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
        className="menu-anchor flex size-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-peach type-label text-on-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
        ) : (
          profile.name.charAt(0).toUpperCase()
        )}
      </button>
      <div
        id={menuId}
        ref={menu}
        popover="auto"
        className="menu-below-end inset-auto m-0 mt-2 w-64 rounded-card border border-line bg-surface p-2 text-ink"
      >
        <div className="border-b border-line px-3 pt-2 pb-3">
          <p className="type-label">{profile.name}</p>
          <p className="truncate type-meta text-ink-muted">{profile.email}</p>
        </div>
        <nav aria-label="Conta" className="flex flex-col pt-2">
          <Link to="/visao-geral" onClick={close} className={itemClasses}>
            Visão geral
          </Link>
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
