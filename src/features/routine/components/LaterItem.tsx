import { Lock } from 'lucide-react'
import { useState } from 'react'
import { areaCategoryId } from '@/shared/theme/areaColors'
import { Button } from '@/shared/ui/Button'
import type { PlannedBlock } from '../api/routineTypes'
import { blockSession } from '../sessionForm'
import { SessionDialog } from './SessionDialog'

export type BlockRowProps = {
  block: PlannedBlock
  date: string
  // Dias para onde a sessão pode ir.
  dates: string[]
}

export function BlockRow({ block, date, dates }: BlockRowProps) {
  const [adjusting, setAdjusting] = useState(false)
  const session = blockSession(block, date)
  return (
    <div data-category={areaCategoryId(block.area)} className="flex flex-wrap items-center gap-3 rounded-card bg-surface px-4 py-3">
      <ItemText title={block.title} detail={block.area} />
      {session ? (
        <>
          <Button variant="ghost" onClick={() => setAdjusting(true)}>
            Mudar
          </Button>
          <SessionDialog
            task={session.task}
            dates={dates}
            current={session.current}
            open={adjusting}
            onClose={() => setAdjusting(false)}
          />
        </>
      ) : (
        <Lock role="img" aria-label="Horário fixo" className="size-4 shrink-0 text-ink-muted" />
      )}
    </div>
  )
}

type ItemTextProps = {
  title: string
  detail: string
}

function ItemText({ title, detail }: ItemTextProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-2 type-label">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-hue-line" />
        <span className="truncate">{title}</span>
      </p>
      <p className="type-meta text-ink-muted">{detail}</p>
    </div>
  )
}
