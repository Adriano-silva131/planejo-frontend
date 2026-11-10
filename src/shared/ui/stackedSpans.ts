// Divide columns entre os valores proporcionalmente, sem sobra: quem perdeu mais no arredondamento ganha a
// coluna que falta. Valor positivo fica com ao menos uma coluna.
export function stackedSpans(values: number[], columns: number) {
  const total = values.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return values.map(() => 0)
  const exact = values.map((value) => (value / total) * columns)
  const spans = exact.map((value, index) => (values[index] > 0 ? Math.max(1, Math.floor(value)) : 0))
  const byRemainder = exact.map((value, index) => ({ index, rest: value - Math.floor(value) })).sort((a, b) => b.rest - a.rest)
  let missing = columns - spans.reduce((sum, span) => sum + span, 0)
  for (const { index } of byRemainder) {
    if (missing <= 0) break
    if (values[index] > 0) {
      spans[index] += 1
      missing -= 1
    }
  }
  return spans
}
