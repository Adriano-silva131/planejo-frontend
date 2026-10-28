export type CategoryColor = {
  id: string
  color: string
}

const hexColor = /^#[0-9a-f]{6}$/i
const safeId = /^[\w-]+$/

let sheet: CSSStyleSheet | undefined

function categorySheet() {
  if (!sheet) {
    sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  }
  return sheet
}

// Os valores vêm do usuário e viram CSS: só entram id e hex que passam na validação.
export function setCategoryColors(categories: CategoryColor[]) {
  const rules = categories
    .filter(({ id, color }) => safeId.test(id) && hexColor.test(color))
    .map(({ id, color }) => `[data-category="${id}"] { --hue: ${color}; }`)
  categorySheet().replaceSync(rules.join('\n'))
}
