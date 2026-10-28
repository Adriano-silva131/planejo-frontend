import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ApiError } from '@/shared/api/apiError'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { useDeleteTask } from '../api/taskQueries'
import type { Task } from '../api/taskTypes'

export type DeleteTaskButtonProps = {
  task: Task
}

export function DeleteTaskButton({ task }: DeleteTaskButtonProps) {
  const [open, setOpen] = useState(false)
  const remove = useDeleteTask()
  const navigate = useNavigate()
  const error = remove.error instanceof ApiError ? remove.error.message : remove.error ? 'Não deu para excluir agora.' : undefined

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Trash2 aria-hidden="true" className="size-4" />
        Excluir
      </Button>
      <ConfirmDialog
        open={open}
        title={`Excluir "${task.title}"?`}
        description="Ela sai do seu plano. Não dá para desfazer."
        confirmLabel="Excluir"
        pending={remove.isPending}
        error={error}
        onCancel={() => {
          setOpen(false)
          remove.reset()
        }}
        onConfirm={() => remove.mutate(task.id, { onSuccess: () => void navigate('/atividades') })}
      />
    </>
  )
}
