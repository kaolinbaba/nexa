import { BarChart3, Bot, CheckCircle2, FolderKanban, LayoutDashboard, ListChecks, Plug, Workflow } from 'lucide-react'
import { seriesFor } from '../app/data.ts'
import { project, smoothPath } from '../lib/chart.ts'

const nav = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: FolderKanban, label: 'Projects' },
  { icon: ListChecks, label: 'Tasks' },
  { icon: Workflow, label: 'Automations' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Plug, label: 'Integrations' },
  { icon: Bot, label: 'Assistant' },
]

const kpis = [
  { label: 'Tasks completed', value: '1,284', delta: '+12%' },
  { label: 'Hours saved', value: '312h', delta: '+18%' },
  { label: 'Live automations', value: '4', delta: '2 paused' },
  { label: 'On-time delivery', value: '94%', delta: '+3 pts' },
]

const run = [
  { label: 'Brief received', meta: 'Intake form · trigger' },
  { label: 'AI summary drafted', meta: 'Scope, risks, budget' },
  { label: 'Project created', meta: '12 tasks from template' },
  { label: 'Team notified', meta: '#studio · 3 people' },
]

/**
 * Decorative, animated miniature of the real dashboard. Hidden from assistive tech (the
 * figure caption describes it) — the real, accessible UI lives at /app.
 */
export function HeroPreview() {
  const s = seriesFor('30d')
  const W = 520
  const H = 150
  const max = Math.max(...s.map((p) => p.completed)) * 1.15
  const a = project(s.map((p) => p.completed), W, H, max)
  const b = project(s.map((p) => p.automated), W, H, max)
  const line = smoothPath(a)
  const area = `${line} L${W - 4},${H} L4,${H} Z`
  const line2 = smoothPath(b)

  return (
    <figure className="relative mx-auto w-full max-w-[1120px]">
      <figcaption className="sr-only">
        Preview of the Nexa dashboard: KPI cards, a 30-day chart of completed and automated tasks, and an automation running step by step.
      </figcaption>
      <div aria-hidden="true" className="glass rounded-[22px] p-1.5 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
        <div className="overflow-hidden rounded-[16px] border border-line bg-bg/90">
          {/* window chrome */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md border border-line bg-bg-deep px-3 py-1 font-mono text-[11px] text-faint">
              nexa / atlas-and-pine / overview
            </div>
            <span className="hidden rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[10px] text-cyan sm:inline">DEMO DATA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[176px_1fr]">
            {/* sidebar */}
            <div className="hidden border-r border-line bg-surface/60 p-3 md:block">
              <div className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5">
                <span className="grid size-6 place-items-center rounded-md bg-linear-to-br from-violet to-brand text-[10px] font-bold text-white">AP</span>
                <span className="text-[12px] font-medium text-text">Atlas &amp; Pine</span>
              </div>
              {nav.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12px] ${active ? 'bg-white/[0.06] text-text' : 'text-faint'}`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </div>
              ))}
            </div>

            {/* main */}
            <div className="min-w-0 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-[15px] font-semibold tracking-tight text-text">Good morning, Maya</div>
                  <div className="text-[11px] text-faint">3 items need your attention</div>
                </div>
                <div className="hidden gap-1 rounded-md border border-line bg-bg-deep p-0.5 text-[10px] sm:flex">
                  <span className="rounded px-2 py-0.5 text-faint">7d</span>
                  <span className="rounded bg-surface-3 px-2 py-0.5 text-text">30d</span>
                  <span className="rounded px-2 py-0.5 text-faint">90d</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {kpis.map((k, i) => (
                  <div key={k.label} className="hero-kpi rounded-lg border border-line bg-surface-2/80 p-2.5" style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
                    <div className="text-[10px] text-faint">{k.label}</div>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <span className="font-display text-[18px] font-semibold tracking-tight text-text">{k.value}</span>
                      <span className="font-mono text-[10px] text-cyan">{k.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 grid gap-2 lg:grid-cols-[1.45fr_1fr]">
                {/* chart */}
                <div className="rounded-lg border border-line bg-surface-2/80 p-3">
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-text">Throughput</span>
                    <span className="flex items-center gap-3 text-faint">
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-brand" /> Completed
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-violet" /> Automated
                      </span>
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="hp-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.35" />
                          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[0.25, 0.5, 0.75].map((g) => (
                        <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--color-line)" strokeDasharray="2 4" />
                      ))}
                      <path d={area} fill="url(#hp-area)" />
                      <path d={line} fill="none" stroke="var(--color-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <path d={line2} fill="none" stroke="var(--color-violet)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />
                    </svg>
                    {/* draw-in: a canvas-colored cover slides away (transform only) */}
                    <div className="hero-wipe absolute inset-0 origin-right bg-surface-2" />
                  </div>
                </div>

                {/* automation run */}
                <div className="rounded-lg border border-line bg-surface-2/80 p-3">
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-text">New brief → kickoff</span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-violet-text">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-pulse-soft rounded-full bg-violet-text" />
                      </span>
                      RUNNING
                    </span>
                  </div>
                  <ol className="relative space-y-2">
                    <span className="absolute left-[9px] top-2 bottom-2 w-px bg-line-strong" />
                    {run.map((r, i) => (
                      <li key={r.label} className="hero-step relative flex items-start gap-2.5" style={{ animationDelay: `${1 + i * 0.7}s` }}>
                        <span className="relative z-10 grid size-[19px] shrink-0 place-items-center rounded-full border border-violet/40 bg-surface-2">
                          <CheckCircle2 className="hero-check size-3 text-cyan" style={{ animationDelay: `${1.3 + i * 0.7}s` }} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-medium text-text">{r.label}</span>
                          <span className="block text-[10px] text-faint">{r.meta}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
