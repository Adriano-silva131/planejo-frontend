import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/auth/supabaseClient'
import { env } from '@/shared/config/env'
import { GoogleUnavailableError } from './googleUnavailableError'

type AuthSettings = {
  external?: { google?: boolean }
}

async function isGoogleEnabled() {
  const response = await fetch(`${env.supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: env.supabasePublishableKey },
  })
  if (!response.ok) return true
  const settings = (await response.json()) as AuthSettings
  return settings.external?.google === true
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      if (!(await isGoogleEnabled())) throw new GoogleUnavailableError()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/entrar/retorno` },
      })
      if (error) throw error
    },
  })
}
