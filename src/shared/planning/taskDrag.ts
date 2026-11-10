import type { DragEvent } from 'react'

// Atividade arrastada da lista "Para encaixar" para a grade da semana, com quantos minutos a sessão ocupa.
const taskDragType = 'application/x-planejo-task'

export type DraggedTask = {
  taskId: string
  minutes: number
}

export function startTaskDrag(event: DragEvent, task: DraggedTask) {
  event.dataTransfer.setData(taskDragType, JSON.stringify(task))
  event.dataTransfer.effectAllowed = 'move'
}

export function isTaskDrag(event: DragEvent) {
  return event.dataTransfer.types.includes(taskDragType)
}

export function draggedTask(event: DragEvent): DraggedTask | undefined {
  try {
    const task: unknown = JSON.parse(event.dataTransfer.getData(taskDragType))
    if (isDraggedTask(task)) return task
  } catch {
    // Arrasto de outra origem.
  }
  return undefined
}

function isDraggedTask(value: unknown): value is DraggedTask {
  if (typeof value !== 'object' || value === null) return false
  const { taskId, minutes } = value as Record<string, unknown>
  return typeof taskId === 'string' && typeof minutes === 'number' && minutes > 0
}
