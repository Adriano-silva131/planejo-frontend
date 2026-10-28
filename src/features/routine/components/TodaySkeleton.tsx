import { joinClasses } from '@/shared/ui/joinClasses'

const blockClasses = 'rounded-card bg-ink/10 motion-safe:animate-pulse'

export function TodaySkeleton() {
  return (
    <div role="status" aria-label="Carregando o seu dia" className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className={joinClasses(blockClasses, 'h-56 lg:col-span-2')} />
      <div className={joinClasses(blockClasses, 'h-56')} />
      <div className={joinClasses(blockClasses, 'h-40 lg:col-span-2')} />
      <div className={joinClasses(blockClasses, 'h-40')} />
    </div>
  )
}
