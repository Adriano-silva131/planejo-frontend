// Cada coluna da grade da Semana: todas iguais na visão geral; com um dia aberto, ele fica com o espaço que sobra e
// os outros viram barras estreitas.
export type ColumnMode = 'overview' | 'open' | 'collapsed'

export function columnMode(date: string, openDate: string | undefined): ColumnMode {
  if (!openDate) return 'overview'
  return date === openDate ? 'open' : 'collapsed'
}

export const columnWidthClasses: Record<ColumnMode, string> = {
  overview: 'min-w-0 flex-1',
  open: 'min-w-0 flex-1',
  collapsed: 'w-10 shrink-0',
}

// Com um dia aberto, a grade inteira dobra de altura, para o eixo e as barras continuarem alinhados.
export function rowsClass(openDate: string | undefined) {
  return openDate ? 'planner-rows-roomy' : 'planner-rows'
}

export const openDayTitleId = (date: string) => `open-day-${date}`
