// A última área usada no Adicionar rápido já vem marcada na próxima vez. É só uma conveniência deste navegador: sem
// acesso ao armazenamento, a pessoa escolhe a área de novo.
const key = 'planejo:quick-add-area'

export function rememberedQuickAddArea() {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function rememberQuickAddArea(area: string) {
  try {
    localStorage.setItem(key, area.trim())
  } catch {
    // Sem armazenamento, nada a lembrar.
  }
}
