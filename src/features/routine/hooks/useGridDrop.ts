import { useState, type DragEvent } from 'react'
import { draggedTask, isTaskDragFor } from '@/shared/planning/taskDrag'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import { minuteAtOffset, type HourRange } from '../weekGrid'
import type { PlaceInput } from './useGridPlacement'

export type GridDropOptions = {
  date: string
  range: HourRange
  enabled: boolean
  onPlace: (input: PlaceInput) => void
}

// Recebe na coluna de um dia a atividade arrastada da lista "Para encaixar" e encaixa uma sessão onde ela caiu.
// Dia fora dos permitidos para a atividade não aceita o arrasto.
export function useGridDrop({ date, range, enabled, onPlace }: GridDropOptions) {
  const [isOver, setIsOver] = useState(false)

  if (!enabled) return { isOver: false, handlers: {} }

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    if (!isTaskDragFor(event, date)) return
    event.preventDefault()
    setIsOver(true)
  }
  const onDrop = (event: DragEvent<HTMLElement>) => {
    setIsOver(false)
    const task = draggedTask(event)
    if (!task || !task.dates.includes(date)) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const start = minuteAtOffset(event.clientY - rect.top, rect.height, range)
    const end = Math.min(start + task.minutes, minutesInDay)
    onPlace({ taskId: task.taskId, date, start: timeOfDayLabel(start), end: timeOfDayLabel(end % minutesInDay) })
  }

  return { isOver, handlers: { onDragOver, onDragLeave: () => setIsOver(false), onDrop } }
}
