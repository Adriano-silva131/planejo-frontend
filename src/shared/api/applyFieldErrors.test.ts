import { describe, expect, it, vi } from 'vitest'
import { ApiError } from './apiError'
import { applyFieldErrors } from './applyFieldErrors'

describe('applyFieldErrors', () => {
  it('sem campos, como no 409 de horário cheio, devolve a mensagem para o alerta geral', () => {
    const setError = vi.fn()
    const message = 'Nesse horário já há duas tarefas: Olist e Lanche (qua 11/11, 15:00–15:30).'
    expect(applyFieldErrors(new ApiError(409, 'schedule_overlap', message), setError, ['title'])).toBe(message)
    expect(setError).not.toHaveBeenCalled()
  })

  it('põe a mensagem no campo que casa e não mostra alerta geral', () => {
    const setError = vi.fn()
    const error = new ApiError(422, 'validation_failed', 'Confira os campos.', { title: ['Dê um nome.'] })
    expect(applyFieldErrors(error, setError, ['title'])).toBeUndefined()
    expect(setError).toHaveBeenCalledWith('title', { message: 'Dê um nome.' })
  })
})
