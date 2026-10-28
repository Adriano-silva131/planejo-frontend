import { joinClasses } from './joinClasses'

export type ButtonVariant = 'primary' | 'brand' | 'inverse' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

type ButtonStyle = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const variantClasses = {
  primary: 'bg-action text-on-action hover:opacity-90',
  brand: 'bg-brand text-on-brand hover:opacity-90',
  inverse: 'bg-on-brand text-brand hover:opacity-90',
  secondary: 'border border-ink/25 bg-surface text-ink hover:border-ink/50',
  ghost: 'text-ink hover:bg-ink/5',
} satisfies Record<ButtonVariant, string>

const sizeClasses = {
  md: 'min-h-12 px-4 md:min-h-11',
  lg: 'min-h-12 px-6',
} satisfies Record<ButtonSize, string>

export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonStyle) {
  return joinClasses(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-control type-control transition',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
