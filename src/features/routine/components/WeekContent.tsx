import { useMemo } from 'react'
import { areaCategoryColors } from '@/shared/theme/areaColors'
import { useCategoryColors } from '@/shared/theme/useCategoryColors'
import { toIsoDate } from '@/shared/time/calendarDate'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { SidebarPortal } from '@/shared/ui/SidebarPortal'
import type { RoutineWeek } from '../api/routineTypes'
import { AreaLegend } from './AreaLegend'
import { WeekDayView } from './WeekDayView'
import { WeekGrid } from './WeekGrid'

export type WeekContentProps = {
  week: RoutineWeek
  now: Date
}

export function WeekContent({ week, now }: WeekContentProps) {
  const today = toIsoDate(now)
  const days = useMemo(() => week.days ?? [], [week])
  const areas = useMemo(() => [...new Set(days.flatMap((day) => (day.blocks ?? []).map((block) => block.area)))], [days])
  const categories = useMemo(() => areaCategoryColors(areas), [areas])
  useCategoryColors(categories)

  if (areas.length === 0) return <EmptyWeek />

  return (
    <div className="flex flex-col gap-4">
      <SidebarPortal>
        <AreaLegend areas={areas} />
      </SidebarPortal>
      <div className="lg:hidden">
        <AreaLegend areas={areas} />
      </div>
      <div className="hidden lg:block">
        <WeekGrid days={days} today={today} nowHour={days.some((day) => day.date === today) ? now.getHours() : undefined} />
      </div>
      <div className="lg:hidden">
        <WeekDayView days={days} today={today} />
      </div>
    </div>
  )
}

function EmptyWeek() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-5 md:p-6">
      <h2 className="type-section">Nada fixo nesta semana.</h2>
      <p className="text-ink-muted">
        Aqui aparecem as atividades com horário fixo. Recorrentes e pontuais entram quando o planejador passar a montar a
        semana.
      </p>
      <ButtonLink to="/atividades/nova" variant="secondary">
        Cadastrar atividade
      </ButtonLink>
    </section>
  )
}
