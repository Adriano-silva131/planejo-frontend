import { useMemo } from 'react'
import { areaCategoryColors } from '@/shared/theme/areaColors'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import { useTaskAreas } from '../api/taskQueries'

// Registra a cor de todas as áreas do usuário para as telas que mostram tarefas.
export function useAreaColorStyles() {
  const areas = useTaskAreas()
  const categories = useMemo(() => areaCategoryColors(areas.data ?? []), [areas.data])
  useCategoryColors(categories)
}
