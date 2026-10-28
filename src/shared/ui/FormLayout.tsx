import type { ReactNode } from 'react'
import { joinClasses } from './joinClasses'

export type FormFieldsProps = {
  children: ReactNode
  className?: string
}

export function FormFields({ children, className }: FormFieldsProps) {
  return <div className={joinClasses('flex flex-col gap-6', className)}>{children}</div>
}

export type FormSectionProps = {
  title: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <section className={joinClasses('flex min-w-0 flex-col gap-6', className)}>
      <h2 className="type-eyebrow text-ink-muted">{title}</h2>
      {children}
    </section>
  )
}

export type FieldRowProps = {
  children: ReactNode
  className?: string
}

export function FieldRow({ children, className }: FieldRowProps) {
  return <div className={joinClasses('grid max-w-md grid-cols-2 gap-4', className)}>{children}</div>
}

export type FormActionsProps = {
  children: ReactNode
  start?: ReactNode
}

export function FormActions({ children, start }: FormActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
      <div>{start}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
