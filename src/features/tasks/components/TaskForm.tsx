import { Button } from '@/shared/ui/Button'
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
  onDone: () => void
}

export function TaskForm({ task, onDone }: TaskFormProps) {
  const { form, submit, alert, areaColor, isSaving } = useTaskForm(task, onDone)
  const kind = form.watch('kind')

  return (
    <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      {/* relative: os inputs sr-only das opções se posicionam aqui, senão esticam a rolagem do painel inteiro. */}
      <div className="relative flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-5 pt-2 pb-6 md:px-6">
        <FormSection title="Sobre a atividade">
          <TaskBasicsFields form={form} areaColor={areaColor.color} onAreaColorChange={areaColor.pick} />
        </FormSection>
        <FormSection title="Quando">
          {kind === 'fixed' && <FixedFields form={form} />}
          {kind === 'recurring' && <RecurringFields form={form} />}
          {kind === 'one_off' && <OneOffFields form={form} />}
        </FormSection>
        {alert && <FormAlert>{alert}</FormAlert>}
      </div>
      <div className="px-5 pb-5 md:px-6 md:pb-6">
        <FormActions start={task && <DeleteTaskButton task={task} onDeleted={onDone} />}>
          <Button variant="ghost" onClick={onDone}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando…' : task ? 'Salvar alterações' : 'Criar atividade'}
          </Button>
        </FormActions>
      </div>
    </form>
  )
}
