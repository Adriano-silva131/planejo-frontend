export type ApiFieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: ApiFieldErrors

  constructor(status: number, code: string, message: string, fields: ApiFieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

// O backend recusa o que deixaria mais de duas coisas no mesmo horário; a mensagem já cita o dia e as tarefas.
export const scheduleOverlapCode = 'schedule_overlap'

export function isScheduleOverlap(error: unknown) {
  return error instanceof ApiError && error.code === scheduleOverlapCode
}
