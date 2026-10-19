import { CalendarCheck } from 'lucide-react'

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <CalendarCheck className="size-10 text-violet-600" />
      <h1 className="text-3xl font-semibold">Planejo</h1>
      <p className="text-slate-500">Planejamento automático da sua rotina com IA.</p>
    </main>
  )
}
