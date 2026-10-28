import { useState } from 'react'
import { areaKey, defaultAreaColor } from '@/shared/theme/areaColors'
import { useTaskAreas } from '../api/taskQueries'

// A cor escolhida fica presa à área digitada: trocar de área mostra a cor da nova.
export function useAreaColor(area: string) {
  const areas = useTaskAreas()
  const [picked, setPicked] = useState<Record<string, string>>({})
  const key = areaKey(area)
  const saved = areas.data?.find((item) => item.color && areaKey(item.area) === key)?.color
  const color = picked[key] ?? saved ?? defaultAreaColor(area)
  // Sem a lista carregada, só uma escolha explícita é enviada, para não sobrescrever a cor salva.
  const changed = areas.isSuccess ? color !== saved : key in picked

  return { color, changed, pick: (value: string) => setPicked((current) => ({ ...current, [key]: value })) }
}
