import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/shared/api/apiError'
import { useMoveSession, usePlaceSession, useRemoveSession } from '../api/useSessionActions'
import { sessionDefaults, sessionFormSchema, type PlacedSession, type SessionFormValues, type SessionTask } from '../sessionForm'

export type SessionFormOptions = {
  task: SessionTask
  dates: string[]
  current?: PlacedSession
  onDone: () => void
}

export function useSessionForm({ task, dates, current, onDone }: SessionFormOptions) {
  const place = usePlaceSession()
  const move = useMoveSession()
  const remove = useRemoveSession()
  const [alert, setAlert] = useState<string>()
  const form = useForm<SessionFormValues>({ resolver: zodResolver(sessionFormSchema(task.kind)), defaultValues: sessionDefaults(dates, current) })

  const handlers = {
    onSuccess: onDone,
    onError: (error: Error) => setAlert(error instanceof ApiError ? error.message : 'Não deu para salvar agora. Tente de novo.'),
  }

  const submit = form.handleSubmit(({ date, start, end }) => {
    setAlert(undefined)
    const times = { start, end: end || undefined }
    if (current) move.mutate({ from: { taskId: task.taskId, date: current.date }, date, ...times }, handlers)
    else place.mutate({ taskId: task.taskId, date, ...times }, handlers)
  })
  const removeSession = current ? () => remove.mutate({ taskId: task.taskId, date: current.date }, handlers) : undefined

  return { form, submit, removeSession, alert, isSaving: place.isPending || move.isPending || remove.isPending }
}
