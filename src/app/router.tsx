import { createBrowserRouter, redirect, type RouteObject } from 'react-router'
import { NotFoundPage } from '@/app/NotFoundPage'
import { RequireSession } from '@/app/RequireSession'
import { SessionLoading } from '@/app/SessionLoading'
import { LandingPage } from '@/features/landing/pages/LandingPage'

const signedInRoutes: RouteObject[] = [
  {
    path: '/meu-dia',
    lazy: async () => ({ Component: (await import('@/app/TodayRoute')).TodayRoute }),
  },
  {
    path: '/semana',
    lazy: async () => ({ Component: (await import('@/app/WeekRoute')).WeekRoute }),
  },
  {
    path: '/atividades',
    lazy: async () => ({ Component: (await import('@/app/TasksRoute')).TasksRoute }),
  },
  {
    path: '/atividades/:id',
    loader: ({ params }) => redirect(`/atividades?atividade=${encodeURIComponent(params.id ?? '')}`),
  },
  {
    path: '/visao-geral',
    lazy: async () => ({ Component: (await import('@/app/OverviewRoute')).OverviewRoute }),
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
