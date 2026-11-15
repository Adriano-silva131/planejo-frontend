import { useEffect, useRef, type ReactNode } from 'react'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import type { PlannedDay } from '../api/routineTypes'
import { useDayView, type DayView } from '../hooks/useDayView'
import { useOpenDayFocus } from '../hooks/useOpenDayFocus'
import type { DayFree } from '../weekSummary'
import { DayViewToggle } from './DayViewToggle'
import { WeekBoard } from './WeekBoard'
import { WeekDayView } from './WeekDayView'
import { WeekGrid } from './WeekGrid'

export type WeekContentProps = {
  days: PlannedDay[]
  free: DayFree[]
  today: string
  now: number
  // O que falta encaixar na semana, acima do quadro.
  tray?: ReactNode
  // No dia aberto: o que dá para encaixar nele, no pé do dia ou ao lado da grade de horários.
  dayTray?: ReactNode
  dayAside?: ReactNode
  openDay: OpenDayControl
}

// Dia aberto e como abrir ou fechar outro.
export type OpenDayControl = {
  date?: string
  open: (date: string) => void
  close: () => void
}

// Em tela larga, a semana em quadro; o dia aberto fica no próprio quadro, por períodos, ou na grade de horários. No
// celular, um dia por vez.
export function WeekContent({ days, free, today, now, tray, dayTray, dayAside, openDay }: WeekContentProps) {
  const hasItems = days.some((day) => (day.blocks ?? []).length > 0 || (day.plans ?? []).length > 0)
  const isOpen = days.some((day) => day.date === openDay.date)
  const { view, setView } = useDayView()
  // A grade e o dia aberto só montam quando o dia abre; quem acompanha a troca para levar o foco é a Semana.
  useOpenDayFocus(openDay.date)
  useViewToggleFocus(view)
  const toggle = <DayViewToggle view={view} onChange={setView} />

  return (
    <div className="flex flex-col gap-6">
      {tray && <div className={isOpen ? 'xl:hidden' : undefined}>{tray}</div>}
      {hasItems ? (
        <>
          <div className="hidden xl:block">
            {isOpen && view === 'hours' ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">{toggle}</div>
                <div className="grid grid-cols-4 items-start gap-8">
                  <div className="col-span-3">
                    <WeekGrid days={days} free={free} today={today} now={now} openDate={openDay.date} onOpen={openDay.open} onClose={openDay.close} />
                  </div>
                  {dayAside}
                </div>
              </div>
            ) : (
              <WeekBoard
                days={days}
                today={today}
                now={now}
                openDate={openDay.date}
                onOpen={openDay.open}
                onClose={openDay.close}
                viewToggle={toggle}
                dayFooter={dayTray}
              />
            )}
          </div>
          <div className="xl:hidden">
            <WeekDayView days={days} today={today} now={now} />
          </div>
        </>
      ) : (
        <EmptyWeek />
      )}
    </div>
  )
}

// Trocar entre períodos e horários desmonta o botão clicado; o foco vai para o escolhido na outra vista.
function useViewToggleFocus(view: DayView) {
  const previous = useRef(view)
  useEffect(() => {
    if (previous.current === view) return
    previous.current = view
    document.querySelector<HTMLElement>(`[data-view-toggle="${view}"]`)?.focus()
  }, [view])
}

function EmptyWeek() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-surface p-5 md:p-6">
      <h2 className="type-section">Nada marcado nesta semana.</h2>
      <p className="text-ink-muted">
        Aqui aparecem as atividades com horário fixo, as recorrentes nos dias de costume e o que você encaixar de
        pontuais, no dia e no período que der.
      </p>
      <ButtonLink to="/atividades?atividade=nova" variant="secondary">
        Cadastrar atividade
      </ButtonLink>
    </section>
  )
}
