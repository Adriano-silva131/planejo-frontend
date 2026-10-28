import type { ReactNode } from 'react'
import { joinClasses } from '@/shared/ui/joinClasses'

export type LandingContainerProps = {
  children: ReactNode
  className?: string
}

export function LandingContainer({ children, className }: LandingContainerProps) {
  return <div className={joinClasses('mx-auto w-full max-w-6xl px-4 md:px-8', className)}>{children}</div>
}
