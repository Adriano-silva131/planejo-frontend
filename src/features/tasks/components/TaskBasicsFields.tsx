import { useId } from 'react'
import { areaKey } from '@/shared/theme/areaColors'
import { OptionGroup } from '@/shared/ui/OptionGroup'
import { TextField } from '@/shared/ui/TextField'
import { useTaskAreas } from '../api/taskQueries'
import { kindOptions } from '../taskLabels'
import type { TaskFieldsProps } from '../types'

const suggestedAreas = ['Trabalho', 'Estudos', 'Saúde', 'Pessoal', 'Lazer']

export function TaskBasicsFields({ form }: TaskFieldsProps) {
  const areas = useTaskAreas()
  const listId = useId()
  const { register, formState } = form
  const options = [...new Map([...(areas.data ?? []), ...suggestedAreas].map((area) => [areaKey(area), area])).values()]

  return (
    <>
      <TextField
        label="Nome"
        placeholder="Ex.: Academia, Aula de inglês"
        error={formState.errors.title?.message}
        {...register('title')}
      />
      <TextField
        label="Área"
        list={listId}
        placeholder="Ex.: Saúde, Trabalho, Estudos"
        hint="A área agrupa atividades parecidas e define a cor delas."
        error={formState.errors.area?.message}
        {...register('area')}
      />
      <datalist id={listId}>
        {options.map((area) => (
          <option key={area} value={area} />
        ))}
      </datalist>
      <OptionGroup legend="Tipo" layout="stack" options={kindOptions} error={formState.errors.kind?.message} {...register('kind')} />
    </>
  )
}
