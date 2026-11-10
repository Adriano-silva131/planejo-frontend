import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { currentTheme, saveTheme } from './themePreference'

export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme)
  const next = theme === 'dark' ? 'light' : 'dark'
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      type="button"
      aria-label={next === 'light' ? 'Usar tema claro' : 'Usar tema escuro'}
      onClick={() => {
        saveTheme(next)
        setTheme(next)
      }}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-control text-ink-muted hover:bg-surface-alt hover:text-ink focus-visible:outline-2 focus-visible:outline-action"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}
