import { areaCategoryId } from '@/shared/theme/areaColors'
import { joinClasses } from '@/shared/ui/joinClasses'
import type { PlannedDay } from '../api/routineTypes'
import { columnWidthClasses } from '../weekColumns'
import { layoutDay, type HourRange } from '../weekGrid'
import { GridLines, NowLine } from './DayMarkers'

export type CollapsedDayColumnProps = {
  day: PlannedDay
  range: HourRange
  rowsClass: string
  isPast: boolean
  // Minuto de agora quando a coluna é de hoje.
  now?: number
  onOpen: (date: string) => void
}

// Dia encolhido ao lado do dia aberto: só a forma do dia, em barras na cor da área. O clique abre o dia; pelo
// teclado, o botão do cabeçalho faz o mesmo.
export function CollapsedDayColumn({ day, range, rowsClass, isPast, now, onOpen }: CollapsedDayColumnProps) {
  return (
    <div
      aria-hidden="true"
      data-date={day.date}
      onClick={() => onOpen(day.date)}
      className={joinClasses('grid cursor-pointer grid-cols-1 hover:bg-ink/5', columnWidthClasses.collapsed, rowsClass, isPast && 'opacity-60')}
    >
      <GridLines range={range} />
      {layoutDay(day.blocks ?? [], range, 'overview').map(({ block, rowStart, rowSpan }) => (
        <span
          key={`${block.taskId}-${block.start}`}
          data-category={areaCategoryId(block.area)}
          className={joinClasses(
            'col-start-1 mx-0.5 my-px rounded-control bg-hue text-on-hue',
            `row-start-${rowStart} row-span-${rowSpan}`,
            block.taskKind === 'fixed' && 'fixed-hatch',
          )}
        />
      ))}
      {now !== undefined && now >= range.startHour * 60 && now < range.endHour * 60 && <NowLine now={now} range={range} />}
    </div>
  )
}
