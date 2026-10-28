import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useTask } from '../api/taskQueries'
import { ListSkeleton } from '../components/ListSkeleton'
import { TaskForm } from '../components/TaskForm'

export function TaskEditorPage() {
  const { id } = useParams()

  if (id) return <EditTask id={id} />
  return (
    <EditorLayout title="Nova atividade">
      <TaskForm />
    </EditorLayout>
  )
}

type EditTaskProps = {
  id: string
}

function EditTask({ id }: EditTaskProps) {
  const task = useTask(id)

  return (
    <EditorLayout title={task.data?.title ?? 'Editar atividade'}>
      {task.isPending && <ListSkeleton />}
      {task.isError && <ErrorState title="Não deu para abrir a atividade." error={task.error} onRetry={() => void task.refetch()} />}
      {task.isSuccess && <TaskForm key={task.data.updatedAt} task={task.data} />}
    </EditorLayout>
  )
}

type EditorLayoutProps = {
  title: string
  children: ReactNode
}

function EditorLayout({ title, children }: EditorLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <title>{`${title} · Planejo`}</title>
      <PageHeader
        title={title}
        back={
          <ButtonLink to="/atividades" variant="ghost" className="-ml-4">
            <ChevronLeft aria-hidden="true" className="size-5" />
            Atividades
          </ButtonLink>
        }
      />
      {children}
    </div>
  )
}
