import { useSearchParams } from 'react-router'

// Área e busca ficam na URL para o filtro sobreviver a recarregar a página.
export function useTaskFilters() {
  const [params, setParams] = useSearchParams()
  const update = (name: string, value?: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(name, value)
        else next.delete(name)
        return next
      },
      { replace: true },
    )

  return {
    area: params.get('area') ?? undefined,
    query: params.get('busca') ?? '',
    setArea: (area?: string) => update('area', area),
    setQuery: (query: string) => update('busca', query),
    clear: () => setParams({}, { replace: true }),
  }
}
