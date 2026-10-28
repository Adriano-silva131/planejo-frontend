import { useSyncExternalStore } from 'react'
import { getSessionState, subscribeSession } from './sessionStore'

export function useSession() {
  return useSyncExternalStore(subscribeSession, getSessionState)
}
