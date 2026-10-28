import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { applyFieldErrors } from '@/shared/api/applyFieldErrors'
import { useSaveTask } from '../api/taskQueries'
import type { Task } from '../api/taskTypes'
import { fromTask, toTaskPayload } from '../taskPayload'
import { emptyTaskForm, taskFormFields, taskFormSchema, type TaskFormValues } from '../taskSchema'

export function useTaskForm(task?: Task) {
  const navigate = useNavigate()
  const save = useSaveTask(task?.id)
  const [alert, setAlert] = useState<string>()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ? fromTask(task) : emptyTaskForm,
  })

  const submit = form.handleSubmit((values) => {
    setAlert(undefined)
    save.mutate(toTaskPayload(values), {
      onSuccess: () => void navigate('/atividades'),
      onError: (error) => setAlert(applyFieldErrors(error, form.setError, taskFormFields)),
    })
  })

  return { form, submit, alert, isSaving: save.isPending }
}
