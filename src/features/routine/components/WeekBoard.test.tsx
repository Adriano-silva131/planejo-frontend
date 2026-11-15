// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiDelete, apiPut } from '@/shared/api/apiClient'
import type { DayPlanItem, PlannedBlock, PlannedDay } from '../api/routineTypes'
import { WeekBoard } from './WeekBoard'

vi.mock('@/shared/api/apiClient', () => ({ apiPut: vi.fn(), apiDelete: vi.fn() }))

const dates = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']
const flags = { adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
const fixed = (title: string, start: string, end: string, adjusted = false): PlannedBlock => ({
  taskId: title, title, area: 'Trabalho', taskKind: 'fixed', start, end, ...flags, adjusted,
})
const plan = (title: string, fields: Partial<DayPlanItem>): DayPlanItem => ({
  taskId: title, title, area: 'Programação', taskKind: 'recurring', source: 'usual', minutes: 60, done: false, ...fields,
})
const weekday = [fixed('Olist', '09:00', '18:00'), fixed('Faculdade', '19:00', '20:00')]
const days: PlannedDay[] = dates.map((date, index) => ({
  date,
  weekday: '',
  blocks: index === 4 ? [fixed('Olist', '09:00', '14:00', true), fixed('Faculdade', '19:00', '20:00')] : index < 5 ? weekday : [],
  plans: [
    ...(index === 1 ? [plan('Academia', { period: 'morning', source: 'checkin', done: true }), plan('Inglês', { period: 'evening' })] : []),
    ...(index === 3 ? [plan('AWS', { period: 'evening' })] : []),
  ],
}))

function renderBoard(openDate?: string) {
  const onOpen = vi.fn()
  const onClose = vi.fn()
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <WeekBoard days={days} today="2026-11-11" now={8 * 60} openDate={openDate} onOpen={onOpen} onClose={onClose} />
      </QueryClientProvider>
    </MemoryRouter>,
  )
  return { onOpen, onClose }
}

beforeEach(() => {
  vi.mocked(apiPut).mockReset().mockResolvedValue(undefined)
  vi.mocked(apiDelete).mockReset().mockResolvedValue(undefined)
})

describe('WeekBoard: visão geral', () => {
  it('mostra os fixos com horário e as recorrentes no período delas', () => {
    renderBoard()
    const thursday = screen.getByRole('region', { name: /quinta, 12 de novembro/ })

    expect(within(thursday).getByText('9h–18h')).toBeTruthy()
    expect(within(thursday).getByRole('heading', { name: 'Noite' })).toBeTruthy()
    expect(within(thursday).getByText('AWS')).toBeTruthy()
    // Manhã: 7h às 9h. Noite: 3 h fora a Faculdade, menos a 1 h da AWS.
    expect(within(thursday).getAllByText('2 h livres')).toHaveLength(2)
  })

  it('num dia que passou mostra só o feito', () => {
    renderBoard()
    const tuesday = screen.getByRole('region', { name: /terça, 10 de novembro/ })

    expect(within(tuesday).getByText('Academia')).toBeTruthy()
    expect(within(tuesday).getByText(', feita')).toBeTruthy()
    expect(within(tuesday).queryByText('Inglês')).toBeNull()
  })

  it('o cabeçalho do dia abre o dia no quadro', () => {
    const { onOpen } = renderBoard()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir quarta, 11 de novembro, hoje' }))
    expect(onOpen).toHaveBeenCalledWith('2026-11-11')
  })
})

describe('WeekBoard: dia aberto', () => {
  it('abre o dia largo, com o livre que sobra, e os outros só com o nome do que têm', () => {
    const { onOpen } = renderBoard('2026-11-12')
    const thursday = screen.getByRole('region', { name: /quinta, 12 de novembro/ })

    expect(within(thursday).getByText(/Sobram/)).toBeTruthy()
    const monday = screen.getByRole('button', { name: 'Abrir segunda, 9 de novembro' })
    expect(within(monday).getByText('Olist')).toBeTruthy()
    fireEvent.click(monday)
    expect(onOpen).toHaveBeenCalledWith('2026-11-09')
  })

  it('muda o horário de um fixo só naquele dia', async () => {
    renderBoard('2026-11-12')
    fireEvent.click(screen.getByRole('button', { name: /9h–18h\s*Olist/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Mudar horário' }))
    fireEvent.change(screen.getByLabelText('Termina às'), { target: { value: '14:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar só nesta quinta' }))

    await waitFor(() => expect(apiPut).toHaveBeenCalledWith('/tasks/Olist/occurrences/2026-11-12', { start: '09:00', end: '14:00' }))
  })

  it('tira um fixo do dia e deixa desfazer', async () => {
    renderBoard('2026-11-12')
    fireEvent.click(screen.getByRole('button', { name: /19h–20h\s*Faculdade/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Não vai ter nesta quinta' }))

    await waitFor(() => expect(apiPut).toHaveBeenCalledWith('/tasks/Faculdade/occurrences/2026-11-12', { skipped: true }))
    const notice = await screen.findByRole('status')
    expect(notice.textContent).toContain('Faculdade não vai ter nesta quinta.')

    fireEvent.click(within(notice).getByRole('button', { name: 'Desfazer' }))
    await waitFor(() => expect(apiDelete).toHaveBeenCalledWith('/tasks/Faculdade/occurrences/2026-11-12'))
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
  })

  it('marca o fixo ajustado e deixa voltar ao padrão', async () => {
    renderBoard('2026-11-13')
    const olist = screen.getByRole('button', { name: /9h–14h\s*Olist\s*só nesta sexta/ })
    fireEvent.click(olist)
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao padrão' }))

    await waitFor(() => expect(apiDelete).toHaveBeenCalledWith('/tasks/Olist/occurrences/2026-11-13'))
  })

  it('Esc fecha o dia, mas dentro da mudança de horário só cancela a mudança', () => {
    const { onClose } = renderBoard('2026-11-12')
    fireEvent.click(screen.getByRole('button', { name: /9h–18h\s*Olist/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Mudar horário' }))
    fireEvent.keyDown(screen.getByLabelText('Começa às'), { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Mudar horário' })).toBeTruthy()

    fireEvent.keyDown(screen.getByRole('button', { name: 'Mudar horário' }), { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
