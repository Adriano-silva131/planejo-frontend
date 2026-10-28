import { createBrowserRouter, type RouteObject } from 'react-router'
import { NotFoundPage } from '@/app/NotFoundPage'
import { RequireSession } from '@/app/RequireSession'
import { SessionLoading } from '@/app/SessionLoading'
import { LandingPage } from '@/features/landing/pages/LandingPage'

const signedInRoutes: RouteObject[] = [
  {
    path: '/meu-dia',
    lazy: async () => ({ Component: (await import('@/features/routine/pages/TodayPage')).TodayPage }),
  },
  {
    path: '/semana',
    lazy: async () => ({ Component: (await import('@/features/routine/pages/WeekPage')).WeekPage }),
  },
  {
    path: '/atividades',
    lazy: async () => ({ Component: (await import('@/features/tasks/pages/TaskListPage')).TaskListPage }),
  },
  {
    path: '/atividades/nova',
    lazy: async () => ({ Component: (await import('@/features/tasks/pages/TaskEditorPage')).TaskEditorPage }),
  },
  {
    path: '/atividades/:id',
    lazy: async () => ({ Component: (await import('@/features/tasks/pages/TaskEditorPage')).TaskEditorPage }),
  },
  {
    path: '/visao-geral',
    lazy: async () => ({ Component: (await import('@/features/progress/pages/OverviewPage')).OverviewPage }),
  },
  {
    path: '/ajustes',
    lazy: async () => {
      const { ComingSoonPage } = await import('@/app/ComingSoonPage')
      return { Component: () => <ComingSoonPage title="Ajustes" /> }
    },
  },
]

const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  {
    path: '/entrar',
    lazy: async () => ({ Component: (await import('@/features/auth/pages/SignInPage')).SignInPage }),
  },
  {
    path: '/entrar/retorno',
    lazy: async () => ({ Component: (await import('@/features/auth/pages/AuthCallbackPage')).AuthCallbackPage }),
  },
  {
    element: <RequireSession />,
    children: [
      {
        lazy: async () => ({ Component: (await import('@/app/shell/AppShell')).AppShell }),
        children: signedInRoutes,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter([{ HydrateFallback: SessionLoading, children: routes }])
