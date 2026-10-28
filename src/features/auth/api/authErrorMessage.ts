import { isAuthError } from '@supabase/supabase-js'
import { GoogleUnavailableError } from './googleUnavailableError'

const rateLimited = 'Muitos pedidos seguidos. Espere um pouco e tente de novo.'

const messagesByCode: Record<string, string> = {
  over_email_send_rate_limit: rateLimited,
  over_request_rate_limit: rateLimited,
  otp_expired: 'Código inválido ou expirado. Confira os números ou peça outro.',
  email_address_invalid: 'Esse e-mail não parece válido.',
  signup_disabled: 'Novas contas estão fechadas no momento.',
}

export function authErrorMessage(error: unknown) {
  if (error instanceof GoogleUnavailableError) return 'O login com Google ainda não está disponível. Use o e-mail por enquanto.'
  if (isAuthError(error)) {
    if (error.code && messagesByCode[error.code]) return messagesByCode[error.code]
    if (error.status === 429) return rateLimited
  }
  return 'Não deu para entrar agora. Tente de novo em instantes.'
}
