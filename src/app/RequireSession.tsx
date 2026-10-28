import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '@/shared/auth/useSession'
import { SessionLoading } from './SessionLoading'

export function RequireSession() {
  const session = useSession()
  const location = useLocation()

  if (session.status === 'loading') return <SessionLoading />
  if (session.status === 'signedOut') {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
