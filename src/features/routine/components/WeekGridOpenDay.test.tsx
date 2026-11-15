// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { PlannedDay } from '../api/routineTypes'
import { visibleHours } from '../weekGrid'
import { dayFree } from '../weekSummary'
import { WeekGrid } from './WeekGrid'

vi.mock('@/shared/api/apiClient', () => ({ apiPut: vi.fn(), apiDelete: vi.fn() }))

const dates = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']
const flags = { adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
const session = (taskId: string, title: string, start: string, end: string) => ({
  taskId, title, area: 'Estudos', taskKind: 'recurring' as const, start, end, ...flags,
})
const tuesday = [session('limpeza', 'Limpeza', '19:00', '19:30'), session('faculdade', 'Faculdade', '19:00', '20:00')]
const days: PlannedDay[] = dates.map((date, index) => ({ date, weekday: '', blocks: index === 1 ? tuesday : [] }))
const today = '2026-11-10'
const now = 8 * 60

function Grid() {
  const [openDate, setOpenDate] = useState<string>()
  const free = days.map((day) => dayFree(day, visibleHours(days), today, now))
  return <WeekGrid days={days} free={free} today={today} now={now} openDate={openDate} onOpen={setOpenDate} onClose={() => setOpenDate(undefined)} />
}

function renderGrid() {
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <Grid />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

const openTuesday = () => fireEvent.click(screen.getByRole('button', { name: /^Abrir terça, 10 de novembro, hoje/ }))

describe('WeekGrid: dia aberto', () => {
  it('na visão geral junta Faculdade e Limpeza; aberto, mostra as duas e leva o foco ao título do dia', () => {
    renderGrid()
    expect(screen.getByText('+ Limpeza')).toBeTruthy()

    openTuesday()

    const region = screen.getByRole('region', { name: /Ter.*10/ })
    expect(region).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: /Ter.*10/ }))
    expect(screen.queryByText('+ Limpeza')).toBeNull()
    expect(screen.getByRole('button', { name: /^Limpeza, Estudos, 19:00–19:30/ })).toBeTruthy()
  })

  it('fecha pelo botão e devolve o foco ao botão do dia', () => {
    renderGrid()
    openTuesday()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar terça, 10 de novembro' }))

    expect(screen.queryByRole('region')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Abrir terça/ }))
  })

  it('Esc fecha o dia, mas com o diálogo da sessão aberto fecha só o diálogo', () => {
    renderGrid()
    openTuesday()
    fireEvent.click(screen.getByRole('button', { name: /^Faculdade, Estudos/ }))
    const dialogField = screen.getByLabelText('Começa às')
    fireEvent.keyDown(dialogField, { key: 'Escape' })
    expect(screen.getByRole('region')).toBeTruthy()

    fireEvent.keyDown(screen.getByRole('heading', { name: /Ter.*10/ }), { key: 'Escape' })
    expect(screen.queryByRole('region')).toBeNull()
  })

  it('a etiqueta com outro bloco abre o dia', () => {
    renderGrid()
    fireEvent.click(screen.getByRole('button', { name: /^Faculdade, Estudos, 19:00–20:00; também Limpeza/ }))
    expect(screen.getByRole('region', { name: /Ter.*10/ })).toBeTruthy()
  })
})
