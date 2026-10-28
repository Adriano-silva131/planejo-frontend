export const meterSegments = 10

export function filledSegments(done: number, total: number) {
  if (total <= 0) return 0
  return Math.min(meterSegments, Math.round((done / total) * meterSegments))
}
