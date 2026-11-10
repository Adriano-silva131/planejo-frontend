const longDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
const narrowWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' })
const deadlineWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
const deadlineMonth = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
const shortWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })

export function longDateLabel(date: Date) {
  return longDate.format(date).replace('-feira', '')
}

export function weekdayInitial(date: Date) {
  return narrowWeekday.format(date).toUpperCase()
}

export function shortWeekdayLabel(date: Date) {
  const label = shortWeekday.format(date).replace('.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// "sábado, 31 out"
export function deadlineLabel(date: Date) {
  const weekday = deadlineWeekday.format(date).replace('-feira', '')
  return `${weekday}, ${date.getDate()} ${deadlineMonth.format(date).replace('.', '')}`
}

// "Quarta-feira"
export function weekdayName(date: Date) {
  const name = deadlineWeekday.format(date)
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Quanto falta até um prazo: "atrasada", "hoje", "amanhã", "em 3 dias".
export function daysLeftLabel(days: number) {
  if (days < 0) return 'atrasada'
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}
