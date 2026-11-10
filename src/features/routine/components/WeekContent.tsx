import type { ReactNode } from 'react'
import { fromIsoDate } from '@/shared/time/calendarDate'
import { weekdayOf } from '@/shared/time/dateLabels'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import type { PlannedDay } from '../api/routineTypes'
import { plannedByArea, type DayFree } from '../weekSummary'
import { AreaLegend } from './AreaLegend'
import { PlannedHoursCard } from './PlannedHoursCard'
import { WeekDayView } from './WeekDayView'
import { WeekGrid } from './WeekGrid'

export type WeekContentProps = {
  days: PlannedDay[]
  free: DayFree[]
  today: string
  now: number
  aside?: ReactNode
  openDay: OpenDayControl
}

// Dia aberto na grade e como abrir ou fechar outro.
export type OpenDayControl = {
  date?: string
  open: (date: string) => void
  close: () => void
}

export function WeekContent({ days, free, today, now, aside, openDay }: WeekContentProps) {
  const opened = days.find((day) => day.date === openDay.date)
  const areas = plannedByArea(days)
  const hoursTitle = opened ? `Horas ${weekdayOf(fromIsoDate(opened.date))}` : 'Horas planejadas'
  const hasItems = days.some((day) => (day.blocks ?? []).length > 0)

  return (
    <div className="grid items-start gap-6 xl:grid-cols-4 xl:gap-8">
      <div className="flex flex-col gap-4 xl:col-span-3">
        {hasItems ? (
          <>
            <div className="lg:hidden">
              <AreaLegend areas={areas.map((item) => item.area)} />
            </div>
            <div className="hidden lg:block">
              <WeekGrid days={days} free={free} today={today} now={now} openDate={openDay.date} onOpen={openDay.open} onClose={openDay.close} />
            </div>
            <div className="lg:hidden">
              <WeekDayView days={days} today={today} />
            </div>
          </>
        ) : (
          <EmptyWeek />
        )}
      </div>
      <div className="flex flex-col gap-6">
        {aside}
        <PlannedHoursCard areas={opened ? plannedByArea([opened]) : areas} title={hoursTitle} />
      </div>
    </div>
  )
}

function EmptyWeek() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card bg-surface p-5 md:p-6">
      <h2 className="type-section">Nada marcado nesta semana.</h2>
      <p className="text-ink-muted">
        Aqui aparecem as atividades com horário fixo e o que você encaixar de recorrentes e pontuais, no dia e no horário
        que der.
      </p>
      <ButtonLink to="/atividades?atividade=nova" variant="secondary">
        Cadastrar atividade
      </ButtonLink>
    </section>
  )
}
