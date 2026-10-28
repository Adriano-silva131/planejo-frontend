import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/auth/supabaseClient'

export function useRequestCode() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
      if (error) throw error
    },
  })
}
