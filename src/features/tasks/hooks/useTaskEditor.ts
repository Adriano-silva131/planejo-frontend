import { useSearchParams } from 'react-router'

export const newTaskParam = 'nova'

// A atividade aberta no painel fica na URL (?atividade=<id> ou ?atividade=nova) para outras telas abrirem o painel por link.
export function useTaskEditor() {
  const [params, setParams] = useSearchParams()
  const update = (value?: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set('atividade', value)
        else next.delete('atividade')
        return next
      },
      { replace: true },
    )

  return {
    editing: params.get('atividade') ?? undefined,
    open: (id: string) => update(id),
    openNew: () => update(newTaskParam),
    close: () => update(),
  }
}
