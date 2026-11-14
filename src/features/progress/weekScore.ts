import type { WeekProgress } from './api/progressTypes'

// Quantas sessões das recorrentes foram feitas na semana, das que elas pedem. Feito além da meta não passa dela.
export function weekScore(progress: WeekProgress) {
  const recurring = progress.recurring ?? []
  return {
    done: recurring.reduce((sum, item) => sum + Math.min(item.done, item.expected), 0),
    total: recurring.reduce((sum, item) => sum + item.expected, 0),
  }
}
