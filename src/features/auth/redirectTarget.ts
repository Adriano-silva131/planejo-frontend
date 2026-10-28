const fallback = '/meu-dia'

export function redirectTarget(state: unknown) {
  if (typeof state !== 'object' || state === null || !('from' in state)) return fallback
  const { from } = state
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : fallback
}
