import { weekdayName } from '@/shared/time/dateLabels'
import { relativeWeekLabel, weekRangeLabel } from '@/shared/time/week'
import { PageHeader } from '@/shared/ui/PageHeader'
import { WeekStepper } from '@/shared/ui/WeekStepper'

export type OverviewHeaderProps = {
  start: Date
  now: Date
  onTrack?: { met: number; total: number }
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function OverviewHeader({ start, now, onTrack, onPrevious, onNext, onToday }: OverviewHeaderProps) {
  const label = relativeWeekLabel(start, now)
  return (
    <PageHeader
      eyebrow={`${weekRangeLabel(start)} · Sem cobrança, só para se situar`}
      title={<OverviewTitle now={now} isCurrentWeek={label === 'Esta semana'} onTrack={onTrack} />}
      actions={<WeekStepper label={label} onPrevious={onPrevious} onNext={onNext} onToday={onToday} />}
    />
  )
}

type OverviewTitleProps = {
  now: Date
  isCurrentWeek: boolean
  onTrack?: { met: number; total: number }
}

function OverviewTitle({ now, isCurrentWeek, onTrack }: OverviewTitleProps) {
  if (!onTrack || onTrack.total === 0) return 'Visão geral'
  const amount = <span className="text-peach-ink">{`${onTrack.met} de ${onTrack.total}`}</span>
  const noun = onTrack.total === 1 ? 'ritmo' : 'ritmos'
  if (isCurrentWeek) {
    return (
      <>
        {weekdayName(now)} e {amount} {noun} já em dia.
      </>
    )
  }
  return (
    <>
      {amount} {noun} em dia na semana.
    </>
  )
}
