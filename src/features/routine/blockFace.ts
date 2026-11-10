// Abaixo de 45 minutos o bloco tem altura para uma linha só: sem respiro vertical e com entrelinha justa. Abaixo de
// 30 nem a linha cabe: o bloco vira uma faixa na cor da área, e o título aparece só ao abrir.
export type BlockSize = 'tiny' | 'short' | 'regular'

export function blockSize(minutes: number): BlockSize {
  if (minutes < 30) return 'tiny'
  return minutes < 45 ? 'short' : 'regular'
}

// Com o mouse em cima ou com foco (toque, Tab), o bloco cresce para baixo por cima da grade e mostra o texto inteiro,
// sem mover o layout. A borda na cor da grade separa o bloco aberto do que ficou embaixo.
export const expandedFaceClasses =
  'group-hover:h-auto group-hover:min-h-full group-hover:opacity-100 group-hover:ring-2 group-hover:ring-surface group-focus:h-auto group-focus:min-h-full group-focus:opacity-100 group-focus:ring-2 group-focus:ring-surface group-focus-visible:outline-2 group-focus-visible:outline-action'

// Os blocos que entraram na etiqueta de outro: o nome quando é um só, a contagem quando são mais.
export function extrasLabel(extras: { title: string }[]) {
  return extras.length === 1 ? `+ ${extras[0].title}` : `+ ${extras.length}`
}
