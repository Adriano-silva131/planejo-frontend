import type { DragEvent } from 'react'

// Atividade arrastada da lista "Para encaixar" para a grade da semana, com quantos minutos a sessão ocupa e os dias
// em que ela pode entrar.
const taskDragType = 'application/x-planejo-task'
// Durante o arrasto só os tipos podem ser lidos: cada dia permitido vira um tipo, para a coluna recusar os outros.
const dateDragType = (date: string) => `application/x-planejo-date-${date}`

export type DraggedTask = {
  taskId: string
  minutes: number
  dates: string[]
}

export function startTaskDrag(event: DragEvent, task: DraggedTask) {
  event.dataTransfer.setData(taskDragType, JSON.stringify(task))
  for (const date of task.dates) event.dataTransfer.setData(dateDragType(date), date)
  event.dataTransfer.effectAllowed = 'move'
}

export function isTaskDragFor(event: DragEvent, date: string) {
  const { types } = event.dataTransfer
  return types.includes(taskDragType) && types.includes(dateDragType(date))
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
  const { taskId, minutes, dates } = value as Record<string, unknown>
  return typeof taskId === 'string' && typeof minutes === 'number' && minutes > 0 && Array.isArray(dates)
}
