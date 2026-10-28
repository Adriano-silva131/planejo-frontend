export function ListSkeleton() {
  return (
    <div role="status" aria-label="Carregando" className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-18 rounded-card bg-ink/10 motion-safe:animate-pulse" />
      ))}
    </div>
  )
}
