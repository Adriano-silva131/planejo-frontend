export type CategoryColor = {
  id: string
  color: string
}

const hexColor = /^#[0-9a-f]{6}$/i
const safeId = /^[\w-]+$/

let sheet: CSSStyleSheet | undefined
// Cada componente na tela registra as próprias categorias; a folha junta todas.
const owners = new Map<string, CategoryColor[]>()

function categorySheet() {
  if (!sheet) {
    sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  }
  return sheet
}

// Os valores vêm do usuário e viram CSS: só entram id e hex que passam na validação.
function render() {
  const rules = [...owners.values()]
    .flat()
    .filter(({ id, color }) => safeId.test(id) && hexColor.test(color))
    .map(({ id, color }) => `[data-category="${id}"] { --hue: ${color}; }`)
  categorySheet().replaceSync(rules.join('\n'))
}

export function setCategoryColors(owner: string, categories: CategoryColor[]) {
  owners.set(owner, categories)
  render()
}

export function removeCategoryColors(owner: string) {
  owners.delete(owner)
  render()
}
