import { Plus } from 'lucide-react'
import { longDateLabel } from '@/shared/time/dateLabels'
import { minutesSinceMidnight, timeOfDayLabel } from '@/shared/time/timeOfDay'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { PageHeader } from '@/shared/ui/PageHeader'

export type TodayHeaderProps = {
  now: Date
  freeMinutes?: number
}

export function TodayHeader({ now, freeMinutes }: TodayHeaderProps) {
  return (
    <PageHeader
      eyebrow={`${longDateLabel(now)} · ${timeOfDayLabel(minutesSinceMidnight(now))}`}
      title={<FreeTimeTitle freeMinutes={freeMinutes} />}
      actions={
        <ButtonLink to="/atividades?atividade=nova" aria-label="Adicionar atividade">
          <Plus aria-hidden="true" className="size-5" />
          <span className="hidden sm:inline">Atividade</span>
        </ButtonLink>
      }
    />
  )
}

type FreeTimeTitleProps = {
  freeMinutes?: number
}

function FreeTimeTitle({ freeMinutes }: FreeTimeTitleProps) {
  if (freeMinutes === undefined) return 'Meu dia'
  if (freeMinutes <= 0) return 'Hoje está cheio.'
  const hours = Math.floor(freeMinutes / 60)
  const [amount, plural] =
    hours > 0 ? [hours === 1 ? '1 hora' : `${hours} horas`, hours > 1] : [`${freeMinutes} min`, freeMinutes > 1]

  return (
    <>
      Ainda {plural ? 'sobram' : 'sobra'} <span className="text-peach-ink">{amount}</span> {plural ? 'livres' : 'livre'} hoje.
    </>
  )
}
