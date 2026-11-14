import type { ReactNode } from 'react'
import type { PlannedDay } from '../api/routineTypes'
import { BoardDayColumn } from './BoardDayColumn'
import { CollapsedBoardDay } from './CollapsedBoardDay'

export type WeekBoardProps = {
  days: PlannedDay[]
  today: string
  now: number
  // Dia aberto no próprio quadro; sem ele, os sete dias lado a lado.
  openDate?: string
  onOpen: (date: string) => void
  onClose: () => void
  viewToggle?: ReactNode
  // O que dá para encaixar no dia aberto, no pé dele.
  dayFooter?: ReactNode
}

// A semana em quadro. Com um dia aberto, ele fica com a maior parte da largura e os outros viram colunas estreitas
// com o nome do que têm, para replanejar o dia sem perder a semana de vista.
export function WeekBoard({ days, today, now, openDate, onOpen, onClose, viewToggle, dayFooter }: WeekBoardProps) {
  if (!days.some((day) => day.date === openDate)) {
    return (
      <div className="grid grid-cols-7 items-start gap-2">
        {days.map((day) => (
          <BoardDayColumn key={day.date} day={day} week={days} today={today} now={now} mode="overview" onOpen={onOpen} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-stretch gap-2">
      {days.map((day) =>
        day.date === openDate ? (
          <div key={day.date} className="min-w-0 flex-5">
            <BoardDayColumn
              day={day}
              week={days}
              today={today}
              now={now}
              mode="open"
              onClose={onClose}
              viewToggle={viewToggle}
              footer={dayFooter}
            />
          </div>
        ) : (
          <div key={day.date} className="flex min-w-0 flex-1">
            <CollapsedBoardDay day={day} today={today} now={now} onOpen={onOpen} />
          </div>
        ),
      )}
    </div>
  )
}
