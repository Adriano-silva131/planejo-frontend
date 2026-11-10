// Na visão geral (36px por hora), abaixo de 45 minutos o bloco tem altura para uma linha só, e abaixo de 30 nem
// ela cabe: vira uma faixa na cor da área, com o título só ao abrir. No dia aberto (72px por hora), de 15 a 44
// minutos cabe título e horário numa linha; a partir de 45, em duas.
export type BlockSize = 'tiny' | 'short' | 'regular' | 'line' | 'stacked'
export type BlockView = 'week' | 'day'

export function blockSize(minutes: number, view: BlockView = 'week'): BlockSize {
  if (view === 'day') {
    if (minutes < 15) return 'tiny'
    return minutes < 45 ? 'line' : 'stacked'
  }
  if (minutes < 30) return 'tiny'
  return minutes < 45 ? 'short' : 'regular'
}

// Tamanhos com respiro vertical: o resto encosta nas bordas para caber a linha.
export const roomySizes: BlockSize[] = ['regular', 'stacked']

// Com o mouse em cima ou com foco (toque, Tab), o bloco cresce para baixo por cima da grade e mostra o texto inteiro,
// sem mover o layout. A borda na cor da grade separa o bloco aberto do que ficou embaixo.
export const expandedFaceClasses =
  'group-hover:h-auto group-hover:min-h-full group-hover:opacity-100 group-hover:ring-2 group-hover:ring-surface group-focus:h-auto group-focus:min-h-full group-focus:opacity-100 group-focus:ring-2 group-focus:ring-surface group-focus-visible:outline-2 group-focus-visible:outline-action'

// Os blocos que entraram na etiqueta de outro: o nome quando é um só, a contagem quando são mais.
export function extrasLabel(extras: { title: string }[]) {
  return extras.length === 1 ? `+ ${extras[0].title}` : `+ ${extras.length}`
}
