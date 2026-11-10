// Abaixo disso o bloco tem altura para uma linha só: sem respiro vertical e com entrelinha justa.
export const shortBlockMinutes = 45

// Com o mouse em cima ou com foco (toque, Tab), o bloco cresce para baixo por cima da grade e mostra o texto inteiro,
// sem mover o layout. A borda na cor da grade separa o bloco aberto do que ficou embaixo.
export const expandedFaceClasses =
  'group-hover:h-auto group-hover:min-h-full group-hover:opacity-100 group-hover:ring-2 group-hover:ring-surface group-focus:h-auto group-focus:min-h-full group-focus:opacity-100 group-focus:ring-2 group-focus:ring-surface group-focus-visible:outline-2 group-focus-visible:outline-action'
