import { Pencil } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import type { Task } from '../api/taskTypes'

export type EditTaskButtonProps = {
  task: Task
  onEdit: (id: string) => void
}

export function EditTaskButton({ task, onEdit }: EditTaskButtonProps) {
  return (
    <Button variant="ghost" size="icon" aria-label={`Editar ${task.title}`} className="-my-2 text-ink-muted" onClick={() => onEdit(task.id)}>
      <Pencil aria-hidden="true" className="size-4" />
    </Button>
  )
}
