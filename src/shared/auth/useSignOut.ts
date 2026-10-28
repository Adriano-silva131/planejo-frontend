import { useNavigate } from 'react-router'
import { supabase } from './supabaseClient'

export function useSignOut() {
  const navigate = useNavigate()

  return async function signOut() {
    await navigate('/', { replace: true })
    await supabase.auth.signOut()
  }
}
