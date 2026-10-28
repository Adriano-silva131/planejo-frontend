import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/apiError'
import { supabase } from '@/shared/auth/supabaseClient'

function isClientError(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
    },
  },
})

// Saída manual, 401 ou sessão expirada: os dados da conta não podem ficar para quem entrar depois.
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') queryClient.clear()
})
