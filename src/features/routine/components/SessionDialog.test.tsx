// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPut } from '@/shared/api/apiClient'
import { ApiError } from '@/shared/api/apiError'
import type { SessionTask } from '../sessionForm'
import { SessionDialog } from './SessionDialog'

vi.mock('@/shared/api/apiClient', () => ({ apiPut: vi.fn(), apiDelete: vi.fn() }))

const task: SessionTask = { taskId: 'ingles', title: 'Inglês', kind: 'recurring', durationMinutes: 60 }
const overlap = 'Nesse horário já há duas tarefas: Olist e Lanche (qua 11/11, 15:00–15:30).'

function withQueries(children: ReactNode) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
}

describe('SessionDialog', () => {
  beforeEach(() => {
    vi.mocked(apiPut).mockReset()
  })

  it('mostra a mensagem da API quando o horário já tem duas coisas', async () => {
    vi.mocked(apiPut).mockRejectedValue(new ApiError(409, 'schedule_overlap', overlap))
    render(withQueries(<SessionDialog task={task} dates={['2026-11-11']} open onClose={() => {}} />))

    fireEvent.change(screen.getByLabelText('Começa às'), { target: { value: '15:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Encaixar' }))

    expect((await screen.findByRole('alert')).textContent).toBe(overlap)
    expect(apiPut).toHaveBeenCalledWith('/tasks/ingles/sessions/2026-11-11', { start: '15:00' })
  })

  it('reabre com o horário atual da sessão', () => {
    const dialog = (start: string, open: boolean) =>
      withQueries(
        <SessionDialog task={task} dates={['2026-11-11']} current={{ date: '2026-11-11', start, end: '11:00' }} open={open} onClose={() => {}} />,
      )
    const { rerender } = render(dialog('10:00', true))
    expect(screen.getByLabelText<HTMLInputElement>('Começa às').value).toBe('10:00')

    rerender(dialog('10:00', false))
    rerender(dialog('10:30', true))
    expect(screen.getByLabelText<HTMLInputElement>('Começa às').value).toBe('10:30')
  })
})
