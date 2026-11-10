import { useState, type DragEvent } from 'react'
import { draggedTask, isTaskDrag } from '@/shared/planning/taskDrag'
import { minutesInDay, timeOfDayLabel } from '@/shared/time/timeOfDay'
import { usePlaceSession } from '../api/useSessionActions'
import { minuteAtOffset, type HourRange } from '../weekGrid'

// Recebe na coluna de um dia a atividade arrastada da lista "Para encaixar" e encaixa uma sessão onde ela caiu.
export function useGridDrop(date: string, range: HourRange, enabled: boolean) {
  const place = usePlaceSession()
  const [isOver, setIsOver] = useState(false)

  if (!enabled) return { isOver: false, failed: false, handlers: {} }

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    if (!isTaskDrag(event)) return
    event.preventDefault()
    setIsOver(true)
  }
  const onDrop = (event: DragEvent<HTMLElement>) => {
    setIsOver(false)
    const task = draggedTask(event)
    if (!task) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const start = minuteAtOffset(event.clientY - rect.top, rect.height, range)
    const end = Math.min(start + task.minutes, minutesInDay)
    place.mutate({ taskId: task.taskId, date, start: timeOfDayLabel(start), end: timeOfDayLabel(end % minutesInDay) })
  }

  return {
    isOver,
    failed: place.isError,
    handlers: { onDragOver, onDragLeave: () => setIsOver(false), onDrop },
  }
}
