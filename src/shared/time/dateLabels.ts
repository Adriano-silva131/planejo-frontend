const longDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
const narrowWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' })
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
