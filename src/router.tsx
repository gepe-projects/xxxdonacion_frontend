import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { authStore } from './lib/auth-store'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // No-op di server (dijaga typeof window). Di browser ini memulai restore
  // Firebase lebih awal sehingga sync saat refresh tidak menunggu komponen.
  authStore.init()

  const router = createTanStackRouter({
    routeTree,
    context: { auth: authStore },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
