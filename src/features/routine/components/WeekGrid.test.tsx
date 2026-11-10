// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPut } from '@/shared/api/apiClient'
import { ApiError } from '@/shared/api/apiError'
import type { PlannedDay } from '../api/routineTypes'
import { visibleHours } from '../weekGrid'
import { dayFree } from '../weekSummary'
import { WeekGrid } from './WeekGrid'

vi.mock('@/shared/api/apiClient', () => ({ apiPut: vi.fn(), apiDelete: vi.fn() }))

const dates = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']
const olist = { taskId: 'olist', title: 'Olist', area: 'Trabalho', taskKind: 'fixed' as const, start: '09:00', end: '18:00' }
const flags = { adjusted: false, continuesFromPreviousDay: false, continuesNextDay: false }
const days: PlannedDay[] = dates.map((date) => ({ date, weekday: '', blocks: [{ ...olist, ...flags }] }))
const today = '2026-11-10'
const now = 8 * 60
const overlap = 'Nesse horário já há duas tarefas: Olist e Almoço (qua 11/11, 12:00–13:00).'

function renderGrid() {
  const free = days.map((day) => dayFree(day, visibleHours(days), today, now))
  const { container } = render(
    <QueryClientProvider client={new QueryClient()}>
      <WeekGrid days={days} free={free} today={today} now={now} />
    </QueryClientProvider>,
  )
  // A primeira grade de linhas é o eixo das horas; as outras são os dias, na ordem da semana.
  const columns = [...container.querySelectorAll<HTMLElement>('.planner-rows')].slice(1)
  for (const column of columns) vi.spyOn(column, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 900))
  return columns
}

// O jsdom não tem DragEvent: o clientY do ponto em que a atividade cai entra à mão.
function drop(column: HTMLElement, dataTransfer: ReturnType<typeof dragData>, clientY: number) {
  const event = createEvent.drop(column, { dataTransfer })
  Object.defineProperty(event, 'clientY', { value: clientY })
  fireEvent(column, event)
}

function dragData(allowed: string[]) {
  const data: Record<string, string> = {
    'application/x-planejo-task': JSON.stringify({ taskId: 'ingles', minutes: 60, dates: allowed }),
    ...Object.fromEntries(allowed.map((date) => [`application/x-planejo-date-${date}`, date])),
  }
  return { types: Object.keys(data), getData: (type: string) => data[type] ?? '' }
}

describe('WeekGrid', () => {
  it('diz ao leitor de tela que a tarefa fixa tem horário fixo', () => {
    renderGrid()
    expect(screen.getAllByText(/Trabalho, .*horário fixo/)).toHaveLength(7)
  })
})

describe('WeekGrid: arrastar para encaixar', () => {
  beforeEach(() => {
    vi.mocked(apiPut).mockReset()
  })

  it('mostra no topo da grade a mensagem da API quando o horário já tem duas coisas, e fecha', async () => {
    vi.mocked(apiPut).mockRejectedValue(new ApiError(409, 'schedule_overlap', overlap))
    const wednesday = renderGrid()[2]

    drop(wednesday, dragData(['2026-11-11']), 300)

    expect((await screen.findByRole('alert')).textContent).toBe(overlap)
    expect(apiPut).toHaveBeenCalledWith('/tasks/ingles/sessions/2026-11-11', expect.objectContaining({ start: '12:00' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }))
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('não aceita soltar num dia fora dos permitidos para a atividade', () => {
    const [, tuesday, wednesday] = renderGrid()
    const data = dragData(['2026-11-11'])

    expect(fireEvent.dragOver(tuesday, { dataTransfer: data })).toBe(true)
    expect(fireEvent.dragOver(wednesday, { dataTransfer: data })).toBe(false)
    drop(tuesday, data, 300)
    expect(apiPut).not.toHaveBeenCalled()
  })
})
