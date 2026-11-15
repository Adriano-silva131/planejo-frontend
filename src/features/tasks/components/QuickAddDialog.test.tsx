// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiPost } from '@/shared/api/apiClient'
import { QuickAddDialog } from './QuickAddDialog'

vi.mock('@/shared/api/apiClient', () => ({ apiGet: vi.fn(), apiPost: vi.fn(), apiPut: vi.fn(), apiDelete: vi.fn() }))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 10, 14, 12, 0))
  // jsdom não tem showModal: o diálogo aparece aberto direto.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  vi.mocked(apiGet).mockResolvedValue({ data: [{ area: 'Saúde', color: '#e08a5c' }, { area: 'Estudos' }] })
  vi.mocked(apiPost).mockImplementation(async (_path, body) => ({ id: 'nova', ...(body as object) }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

function renderDialog() {
  const onAdded = vi.fn()
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <QuickAddDialog open onClose={vi.fn()} onAdded={onAdded} />
      </QueryClientProvider>
    </MemoryRouter>,
  )
  return onAdded
}

describe('QuickAddDialog', () => {
  it('sem horário, deixa claro que vira prazo e cria a pontual até o dia', async () => {
    const onAdded = renderDialog()
    fireEvent.change(screen.getByLabelText('O quê?'), { target: { value: 'Mandar o relatório' } })
    fireEvent.click(await screen.findByRole('radio', { name: 'Saúde' }))

    expect(screen.getByText(/fazer até hoje/).textContent).toContain('Para encaixar')
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar com prazo' }))

    await waitFor(() =>
      expect(apiPost).toHaveBeenCalledWith('/tasks', { title: 'Mandar o relatório', area: 'Saúde', kind: 'one_off', priority: 'medium', deadline: '2026-11-14' }),
    )
    await waitFor(() => expect(onAdded).toHaveBeenCalledWith(expect.objectContaining({ kind: 'deadline', when: 'hoje' })))
  })

  it('com horário, cria um compromisso no dia escolhido', async () => {
    renderDialog()
    fireEvent.change(screen.getByLabelText('O quê?'), { target: { value: 'Vôlei' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Amanhã' }))
    fireEvent.change(screen.getByLabelText('Começa às'), { target: { value: '16:00' } })
    fireEvent.change(screen.getByLabelText('Termina às'), { target: { value: '18:00' } })
    fireEvent.click(await screen.findByRole('radio', { name: 'Saúde' }))

    expect(screen.getByText(/amanhã, das 16:00 às 18:00/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar compromisso' }))

    await waitFor(() =>
      expect(apiPost).toHaveBeenCalledWith('/tasks', { title: 'Vôlei', area: 'Saúde', kind: 'fixed', date: '2026-11-15', start: '16:00', end: '18:00' }),
    )
  })

  it('só com o início, pede o fim ou que tire o horário', async () => {
    renderDialog()
    fireEvent.change(screen.getByLabelText('O quê?'), { target: { value: 'Vôlei' } })
    fireEvent.change(screen.getByLabelText('Começa às'), { target: { value: '16:00' } })
    fireEvent.click(await screen.findByRole('radio', { name: 'Saúde' }))
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar compromisso' }))

    expect(screen.getByText('Informe o início e o fim, ou apague os dois para virar prazo.')).toBeTruthy()
    expect(apiPost).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Tirar horário' }))
    expect(screen.getByRole('button', { name: 'Adicionar com prazo' })).toBeTruthy()
  })
})
