import type { UseFormReturn } from 'react-hook-form'
import type { TaskFormValues } from './taskSchema'

export type TaskFieldsProps = {
  form: UseFormReturn<TaskFormValues>
}
