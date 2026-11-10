import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { applyFieldErrors } from '@/shared/api/applyFieldErrors'
import { useSaveTask } from '../api/taskQueries'
import type { Task } from '../api/taskTypes'
import { fromTask, toTaskPayload } from '../taskPayload'
import { emptyTaskForm, taskFormFields, taskFormSchema, type TaskFormValues } from '../taskSchema'
import { useAreaColor } from './useAreaColor'

export function useTaskForm(task: Task | undefined, onSaved: () => void) {
  const save = useSaveTask(task?.id)
  const [alert, setAlert] = useState<string>()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ? fromTask(task) : emptyTaskForm,
  })
  const areaColor = useAreaColor(useWatch({ control: form.control, name: 'area' }))

  const submit = form.handleSubmit((values) => {
    setAlert(undefined)
    const fields = toTaskPayload(values)
    const color = areaColor.changed ? { area: fields.area, color: areaColor.color } : undefined
    save.mutate({ fields, areaColor: color }, {
      onSuccess: onSaved,
      onError: (error) => setAlert(applyFieldErrors(error, form.setError, taskFormFields)),
    })
  })

  return { form, submit, alert, areaColor, isSaving: save.isPending }
}
