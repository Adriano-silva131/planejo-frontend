import { ListPlus, RefreshCw, Sparkles } from 'lucide-react'
import { LandingContainer } from './LandingContainer'

const steps = [
  {
    icon: ListPlus,
    title: 'Conte o que importa',
    text: 'Cadastre atividades, categorias e horários fixos. Pode ser a vida toda ou só o trabalho e os estudos.',
  },
  {
    icon: Sparkles,
    title: 'A IA monta o plano',
    text: 'Ela encaixa tudo no tempo que você tem e deixa espaço livre e descanso no meio do caminho.',
  },
  {
    icon: RefreshCw,
    title: 'O plano muda com você',
    text: 'Surgiu um imprevisto? Ela sugere um ajuste, e você revisa antes de aceitar.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" aria-labelledby="how-title" className="scroll-mt-6 py-12 md:py-16">
      <LandingContainer className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="type-eyebrow text-accent">Como funciona</p>
          <h2 id="how-title" className="type-title">
            Três passos, nenhuma planilha.
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 md:p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-peach text-on-peach">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="type-section">{title}</h3>
              <p className="text-ink-muted">{text}</p>
            </li>
          ))}
        </ol>
      </LandingContainer>
    </section>
  )
}
