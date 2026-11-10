export function DayLineLegend() {
  return (
    <ul aria-hidden="true" className="flex flex-wrap items-center gap-4 type-meta text-ink-muted">
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-control bg-ink-muted" />
        Compromisso
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-control bg-surface-alt" />
        Livre
      </li>
    </ul>
  )
}
