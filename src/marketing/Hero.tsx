import { ArrowRight, Bot, FolderKanban, LineChart, ListChecks, Plug, Workflow } from 'lucide-react'
import { Link } from '../components/Link.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { HeroFlow } from './HeroFlow.tsx'
import { HeroPreview } from './HeroPreview.tsx'

const capabilities = [
  { icon: Workflow, label: 'AI automations', to: '#automation' },
  { icon: FolderKanban, label: 'Projects', to: '#features' },
  { icon: ListChecks, label: 'Tasks', to: '#walkthrough' },
  { icon: LineChart, label: 'Analytics', to: '#analytics' },
  { icon: Plug, label: 'Integrations', to: '#integrations' },
  { icon: Bot, label: 'AI assistant', to: '/app/assistant' },
]

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-14 pt-12 sm:pt-16 lg:pb-16 lg:pt-12">
      {/* hairline grid, faded toward the edges */}
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)]" />
      <HeroFlow />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-brand)_22%,transparent),transparent)]" />

      <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6">
        <p className="fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 py-1 pl-1 pr-3 text-[0.8rem] text-muted">
          <span className="rounded-full bg-violet/15 px-2 py-0.5 font-mono text-xs text-violet-text">Concept</span>
          An AI operations platform for modern teams
        </p>
        <h1
          id="hero-title"
          className="fade-up mx-auto mt-5 max-w-[20ch] font-display text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
          style={{ animationDelay: '0.06s' }}
        >
          Smarter workflows,<br className="hidden sm:block" /> <span className="text-gradient">beautifully connected.</span>
        </h1>
        <p className="fade-up mx-auto mt-5 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: '0.12s' }}>
          Nexa brings projects, tasks, automations and analytics into one calm workspace, with an AI operator that takes care of the
          busywork so your team can focus on the work that matters.
        </p>
        <div className="fade-up mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.18s' }}>
          <ButtonLink to="/app/overview?tour=1" className="w-full sm:w-auto">
            Explore Live Demo
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/app/overview" variant="secondary" className="w-full sm:w-auto">
            View Dashboard
          </ButtonLink>
        </div>
        <p className="fade-up mt-4 font-mono text-xs text-faint" style={{ animationDelay: '0.22s' }}>
          Interactive demo · no sign-up · runs entirely in your browser
        </p>
      </div>

      <div className="relative mt-10 px-4 sm:mt-12 sm:px-6">
        {/* A horizon of light the product rests on (outside the animated layer so it is never clipped). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-28 h-[420px] -z-10 bg-[radial-gradient(ellipse_48%_55%_at_50%_45%,color-mix(in_oklab,var(--color-violet)_22%,transparent),color-mix(in_oklab,var(--color-brand)_10%,transparent)_45%,transparent_75%)]" />
        <div className="fade-up" style={{ animationDelay: '0.3s' }}>
          <HeroPreview />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6">
        <p className="eyebrow text-center">One workspace, six connected capabilities</p>
        <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {capabilities.map(({ icon: Icon, label, to }) => (
            <li key={label} className="bg-bg">
              <Link to={to} className="group flex min-h-16 items-center justify-center gap-2.5 px-4 text-sm text-muted transition-colors hover:bg-surface hover:text-text">
                <Icon className="size-4 text-brand-text transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
