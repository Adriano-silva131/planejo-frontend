import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export type SessionState =
  | { status: 'loading' }
  | { status: 'signedIn'; session: Session }
  | { status: 'signedOut' }

let state: SessionState = { status: 'loading' }
const listeners = new Set<() => void>()

function publish(session: Session | null) {
  state = session ? { status: 'signedIn', session } : { status: 'signedOut' }
  listeners.forEach((listener) => listener())
}

void supabase.auth.getSession().then(({ data }) => publish(data.session))
supabase.auth.onAuthStateChange((_event, session) => publish(session))

export function subscribeSession(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSessionState() {
  return state
}
