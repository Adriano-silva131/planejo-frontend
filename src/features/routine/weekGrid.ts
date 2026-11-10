import { minutesOfDay } from '@/shared/time/timeOfDay'
import type { PlannedDay, RoutineBlock } from './api/routineTypes'

export const slotMinutes = 5
export const maxLanes = 4

export type HourRange = { startHour: number; endHour: number }

export type PlacedBlock = {
  block: RoutineBlock
  rowStart: number
  rowSpan: number
  lane: number
  // Ordem de empilhamento: maior que a de todo bloco anterior com que se sobrepõe, até maxLanes - 1.
  layer: number
  overlaps: boolean
  // Lado a lado em vez de cascata: metade esquerda para o de baixo, direita para o de cima.
  side?: 'left' | 'right'
}

// Abaixo disso de diferença entre os começos, o bloco de cima cobriria o título do de baixo.
const titleMinutes = 30

const defaultRange: HourRange = { startHour: 7, endHour: 22 }

export function visibleHours(days: PlannedDay[]): HourRange {
  const spans = days.flatMap((day) => day.blocks ?? [])
  if (spans.length === 0) return defaultRange
  const earliest = Math.min(...spans.map((span) => minutesOfDay(span.start)))
  const latest = Math.max(...spans.map((span) => minutesOfDay(span.end)))
  return {
    startHour: Math.min(defaultRange.startHour, Math.floor(earliest / 60)),
    endHour: Math.max(defaultRange.endHour, Math.ceil(latest / 60)),
  }
}

export function rowCount(range: HourRange) {
  return ((range.endHour - range.startHour) * 60) / slotMinutes
}

export function hourRow(hour: number, range: HourRange) {
  return ((hour - range.startHour) * 60) / slotMinutes + 1
}

export function rowPlacement(start: number, end: number, range: HourRange) {
  const rangeStart = range.startHour * 60
  const from = Math.max(start, rangeStart)
  const to = Math.min(end, range.endHour * 60)
  return {
    rowStart: Math.floor((from - rangeStart) / slotMinutes) + 1,
    rowSpan: Math.max(1, Math.ceil((to - from) / slotMinutes)),
  }
}

// Blocos sobrepostos entram em cascata: cada faixa nova começa um pouco mais à direita, para o bloco de baixo
// manter a largura e o título visíveis. Os que não se sobrepõem ocupam o dia todo. O que começa depois fica por
// cima, mesmo quando reaproveita uma faixa livre. Começos iguais deixam o mais longo embaixo. Dois blocos que
// começam quase juntos ficam lado a lado, porque na cascata o de cima taparia o título do de baixo.
export function layoutDay(blocks: RoutineBlock[], range: HourRange): PlacedBlock[] {
  const spans = blocks
    .map((block) => ({ block, ...clampSpan(block, range) }))
    .sort((a, b) => a.start - b.start || b.end - a.end)
  return markSideBySide(cascade(spans, range), spans)
}

type Span = { block: RoutineBlock; start: number; end: number }

function cascade(spans: Span[], range: HourRange): PlacedBlock[] {
  const laneEnds: number[] = []
  const layers: number[] = []
  return spans.map(({ block, start, end }, index) => {
    const free = laneEnds.findIndex((laneEnd) => laneEnd <= start)
    const lane = free === -1 ? Math.min(laneEnds.length, maxLanes - 1) : free
    laneEnds[lane] = Math.max(laneEnds[lane] ?? 0, end)
    const below = spans.slice(0, index).flatMap((other, otherIndex) => (other.end > start ? [layers[otherIndex] + 1] : []))
    layers[index] = Math.min(Math.max(0, ...below), maxLanes - 1)
    return {
      block,
      lane,
      layer: layers[index],
      overlaps: spans.some((other, otherIndex) => otherIndex !== index && other.start < end && start < other.end),
      ...rowPlacement(start, end, range),
    }
  })
}

function markSideBySide(placed: PlacedBlock[], spans: Span[]) {
  spans.forEach((later, index) => {
    const lower = spans.findIndex(
      (earlier, earlierIndex) =>
        earlierIndex < index && earlier.end > later.start && later.start - earlier.start < titleMinutes && placed[earlierIndex].lane === 0,
    )
    if (lower === -1 || placed[index].lane !== 1) return
    placed[lower].side = 'left'
    placed[index].side = 'right'
  })
  return placed
}

function clampSpan(block: RoutineBlock, range: HourRange) {
  return {
    start: Math.max(minutesOfDay(block.start), range.startHour * 60),
    end: Math.min(minutesOfDay(block.end), range.endHour * 60),
  }
}

// Hora em que a grade abre: perto de agora na semana atual, ou no começo do dia útil nas outras.
export function initialScrollHour(range: HourRange, nowHour: number | undefined) {
  const preferred = nowHour === undefined ? 7 : Math.max(nowHour - 1, 0)
  return Math.min(Math.max(preferred, range.startHour), range.endHour - 1)
}

// Minuto do dia sob o ponto em que algo foi solto na coluna, arredondado para step minutos.
export function minuteAtOffset(offset: number, height: number, range: HourRange, step = 15) {
  const span = (range.endHour - range.startHour) * 60
  const minute = range.startHour * 60 + (Math.min(Math.max(offset, 0), height) / height) * span
  return Math.min(Math.round(minute / step) * step, range.endHour * 60 - step)
}
