const variables = {
  apiUrl: ['VITE_API_URL', import.meta.env.VITE_API_URL],
  supabaseUrl: ['VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL],
  supabasePublishableKey: ['VITE_SUPABASE_PUBLISHABLE_KEY', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY],
} as const

type EnvName = keyof typeof variables

const missing = Object.values(variables)
  .filter(([, value]) => !value)
  .map(([name]) => name)

if (missing.length > 0) {
  throw new Error(`Configuração ausente: ${missing.join(', ')}. Copie o .env.example para .env.local e preencha.`)
}

export const env = Object.fromEntries(
  Object.entries(variables).map(([key, [, value]]) => [key, value.replace(/\/$/, '')]),
) as Record<EnvName, string>
