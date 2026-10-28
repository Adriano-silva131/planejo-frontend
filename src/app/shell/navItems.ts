import { BarChart3, CalendarDays, List, Settings, Sun, type LucideIcon } from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const primaryNavItems: NavItem[] = [
  { to: '/meu-dia', label: 'Meu dia', icon: Sun },
  { to: '/semana', label: 'Semana', icon: CalendarDays },
  { to: '/atividades', label: 'Atividades', icon: List },
]

export const overviewNavItem: NavItem = { to: '/visao-geral', label: 'Visão geral', icon: BarChart3 }

export const settingsNavItem: NavItem = { to: '/ajustes', label: 'Ajustes', icon: Settings }
