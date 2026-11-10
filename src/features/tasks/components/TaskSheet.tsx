import { ErrorState } from '@/shared/ui/ErrorState'
import { Sheet } from '@/shared/ui/Sheet'
import { useTask } from '../api/taskQueries'
import { newTaskParam } from '../hooks/useTaskEditor'
import { ListSkeleton } from './ListSkeleton'
import { TaskForm } from './TaskForm'

export type TaskSheetProps = {
  editing: string
  onClose: () => void
}

export function TaskSheet({ editing, onClose }: TaskSheetProps) {
  if (editing === newTaskParam) {
    return (
      <Sheet eyebrow="Nova atividade" title="O que entra no plano?" onClose={onClose}>
        {(close) => <TaskForm onDone={close} />}
      </Sheet>
    )
  }
  return <EditTaskSheet id={editing} onClose={onClose} />
}

type EditTaskSheetProps = {
  id: string
  onClose: () => void
}

function EditTaskSheet({ id, onClose }: EditTaskSheetProps) {
  const task = useTask(id)

  return (
    <Sheet eyebrow="Editar atividade" title={task.data?.title ?? 'Atividade'} onClose={onClose}>
      {(close) => (
        <>
          {task.isPending && (
            <div className="px-5 md:px-6">
              <ListSkeleton />
            </div>
          )}
          {task.isError && (
            <div className="px-5 md:px-6">
              <ErrorState title="Não deu para abrir a atividade." error={task.error} onRetry={() => void task.refetch()} />
            </div>
          )}
          {task.isSuccess && <TaskForm key={task.data.updatedAt} task={task.data} onDone={close} />}
        </>
      )}
    </Sheet>
  )
}
