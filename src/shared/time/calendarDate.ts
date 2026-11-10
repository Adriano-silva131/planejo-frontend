export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function fromIsoDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const dayMs = 24 * 60 * 60 * 1000

// Negativo quando `to` vem antes de `from`.
export function daysBetween(from: string, to: string) {
  return Math.round((fromIsoDate(to).getTime() - fromIsoDate(from).getTime()) / dayMs)
}
