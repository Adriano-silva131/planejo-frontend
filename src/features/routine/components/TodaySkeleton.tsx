import { joinClasses } from '@/shared/ui/joinClasses'

const blockClasses = 'rounded-card bg-surface-alt motion-safe:animate-pulse'

export function TodaySkeleton() {
  return (
    <div role="status" aria-label="Carregando o seu dia" className="flex flex-col gap-6 lg:gap-8">
      <div className={joinClasses(blockClasses, 'h-36')} />
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className={joinClasses(blockClasses, 'h-40 lg:col-span-2')} />
        <div className={joinClasses(blockClasses, 'h-40')} />
        <div className={joinClasses(blockClasses, 'h-48 lg:col-span-2')} />
        <div className={joinClasses(blockClasses, 'h-48')} />
      </div>
    </div>
  )
}
