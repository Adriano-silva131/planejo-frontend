export type Theme = 'light' | 'dark'

const storageKey = 'planejo-theme'

export function storedTheme(): Theme | undefined {
  try {
    const value = localStorage.getItem(storageKey)
    return value === 'light' || value === 'dark' ? value : undefined
  } catch {
    return undefined
  }
}

// Sem escolha salva, o tema segue o sistema.
export function currentTheme(): Theme {
  return storedTheme() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function applyTheme(theme: Theme | undefined) {
  if (theme) document.documentElement.dataset.theme = theme
  else delete document.documentElement.dataset.theme
}

export function saveTheme(theme: Theme) {
  applyTheme(theme)
  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    // Sem armazenamento, a escolha vale só até recarregar a página.
  }
}
