import { lazy, Suspense } from 'react'
import { useLocation } from './lib/router.ts'
import MarketingPage from './marketing/MarketingPage.tsx'

// The dashboard is code-split: marketing visitors don't download it until they open the demo.
const DashboardApp = lazy(() => import('./app/DashboardApp.tsx'))

export default function App() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/app')) {
    return (
      <Suspense fallback={<div className="grid min-h-dvh place-items-center text-sm text-muted">Loading the demo workspace…</div>}>
        <DashboardApp />
      </Suspense>
    )
  }
  return <MarketingPage />
}
