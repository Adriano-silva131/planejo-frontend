import type { Session } from '@supabase/supabase-js'

export type SessionProfile = {
  name: string
  email: string
  avatarUrl?: string
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

export function sessionProfile(session: Session): SessionProfile {
  const metadata = session.user.user_metadata
  const email = session.user.email ?? ''
  return {
    name: text(metadata.full_name) ?? text(metadata.name) ?? email.split('@')[0],
    email,
    avatarUrl: text(metadata.avatar_url),
  }
}
