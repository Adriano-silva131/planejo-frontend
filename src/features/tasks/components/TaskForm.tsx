import { Button } from '@/shared/ui/Button'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { FormAlert } from '@/shared/ui/FormAlert'
import { FormActions, FormSection } from '@/shared/ui/FormLayout'
import type { Task } from '../api/taskTypes'
import { useTaskForm } from '../hooks/useTaskForm'
import { DeleteTaskButton } from './DeleteTaskButton'
import { FixedFields } from './FixedFields'
import { OneOffFields, RecurringFields } from './FlexibleFields'
import { TaskBasicsFields } from './TaskBasicsFields'

export type TaskFormProps = {
  task?: Task
}

export function TaskForm({ task }: TaskFormProps) {
  const { form, submit, alert, isSaving } = useTaskForm(task)
  const kind = form.watch('kind')

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6 rounded-card border border-line bg-surface p-5 md:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <FormSection title="Sobre a atividade">
          <TaskBasicsFields form={form} />
        </FormSection>
        <FormSection title="Quando" className="lg:border-l lg:border-line lg:pl-8">
          {kind === 'fixed' && <FixedFields form={form} />}
          {kind === 'recurring' && <RecurringFields form={form} />}
          {kind === 'one_off' && <OneOffFields form={form} />}
        </FormSection>
      </div>
      {alert && <FormAlert>{alert}</FormAlert>}
      <FormActions start={task && <DeleteTaskButton task={task} />}>
        <ButtonLink to="/atividades" variant="ghost">
          Cancelar
        </ButtonLink>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : task ? 'Salvar alterações' : 'Criar atividade'}
        </Button>
      </FormActions>
    </form>
  )
}
