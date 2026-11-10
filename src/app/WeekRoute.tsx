import { WeekPage } from '@/features/routine/pages/WeekPage'
import { ToFitCard } from './week/ToFitCard'

export function WeekRoute() {
  return <WeekPage aside={<ToFitCard />} />
}
