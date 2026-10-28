import { supabase } from '@/shared/auth/supabaseClient'
import { env } from '@/shared/config/env'
import { ApiError, type ApiFieldErrors } from './apiError'
import type { components } from './schema'

type ErrorResponse = components['schemas']['ErrorResponse']
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Query = Record<string, string | number | undefined>

type RequestOptions = {
  query?: Query
  body?: unknown
}

const unavailableMessage = 'Não deu para falar com o Planejo agora. Tente de novo em instantes.'
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export async function apiRequest<T>(method: Method, path: string, { query = {}, body }: RequestOptions = {}) {
  const url = new URL(`${env.apiUrl}/v1${path}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  const response = await send(method, url, body)
  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiGet = <T>(path: string, query?: Query) => apiRequest<T>('GET', path, { query })
export const apiPost = <T>(path: string, body?: unknown) => apiRequest<T>('POST', path, { body })
export const apiPut = <T>(path: string, body?: unknown) => apiRequest<T>('PUT', path, { body })
export const apiDelete = (path: string) => apiRequest<void>('DELETE', path)

async function send(method: Method, url: URL, body: unknown) {
  const { data } = await supabase.auth.getSession()
  const headers = new Headers({ Accept: 'application/json', 'Time-Zone': timeZone })
  if (data.session) headers.set('Authorization', `Bearer ${data.session.access_token}`)
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  try {
    return await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw new ApiError(0, 'network_error', unavailableMessage)
  }
}

async function toApiError(response: Response) {
  if (response.status === 401) await supabase.auth.signOut()
  const body = (await response.json().catch(() => undefined)) as ErrorResponse | undefined
  const error = body?.error
  return new ApiError(response.status, error?.code ?? 'unexpected', error?.message ?? unavailableMessage, cleanFields(error?.fields))
}

function cleanFields(fields: Record<string, string[] | null> = {}): ApiFieldErrors {
  return Object.fromEntries(Object.entries(fields).map(([name, messages]) => [name, messages ?? []]))
}
