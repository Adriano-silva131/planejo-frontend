import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiPost } from './apiClient'
import { ApiError, isScheduleOverlap } from './apiError'

vi.mock('@/shared/auth/supabaseClient', () => ({
  supabase: { auth: { getSession: () => Promise.resolve({ data: { session: { access_token: 'token' } } }), signOut: vi.fn() } },
}))
vi.mock('@/shared/config/env', () => ({ env: { apiUrl: 'http://api.test' } }))

const overlap = { error: { code: 'schedule_overlap', message: 'Nesse horário já há duas tarefas: Olist e Lanche (qua 11/11, 15:00–15:30).' } }

function respond(status: number, body: unknown) {
  const fetchMock = vi.fn((_url: URL, _init: RequestInit) =>
    Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('apiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('manda o fuso do aparelho ao criar tarefa, para a API saber qual é a semana atual', async () => {
    const fetchMock = respond(201, { id: 'olist' })
    await apiPost('/tasks', { title: 'Olist' })
    const headers = new Headers(fetchMock.mock.calls[0][1].headers)
    expect(headers.get('Time-Zone')).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  it('transforma o 409 de horário cheio em ApiError com o código e a mensagem da API', async () => {
    respond(409, overlap)
    const error = await apiPost('/tasks', {}).catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, code: 'schedule_overlap', message: overlap.error.message, fields: {} })
    expect(isScheduleOverlap(error)).toBe(true)
    expect(isScheduleOverlap(new ApiError(422, 'session_past_midnight', 'x'))).toBe(false)
  })
})
