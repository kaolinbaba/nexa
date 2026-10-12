import { useEffect } from 'react'
import { AnalyticsSection } from './AnalyticsSection.tsx'
import { FinalCta, Footer } from './Closing.tsx'
import { Features } from './Features.tsx'
import { Hero } from './Hero.tsx'
import { Integrations } from './Integrations.tsx'
import { Nav } from './Nav.tsx'
import { Pricing } from './Pricing.tsx'
import { Walkthrough } from './Walkthrough.tsx'
import { WorkflowSection } from './WorkflowSection.tsx'

export default function MarketingPage() {
  useEffect(() => {
    document.title = 'Nexa — Smarter workflows, beautifully connected'
  }, [])
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface-3 focus:px-4 focus:py-2.5">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Features />
        <WorkflowSection />
        <AnalyticsSection />
        <Integrations />
        <Walkthrough />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
