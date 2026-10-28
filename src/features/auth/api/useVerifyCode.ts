import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/auth/supabaseClient'

type VerifyCodeInput = {
  email: string
  code: string
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: async ({ email, code }: VerifyCodeInput) => {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
      if (error) throw error
    },
  })
}
