import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/apiError'

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
