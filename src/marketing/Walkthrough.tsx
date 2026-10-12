import { ArrowRight, CalendarClock, CheckCircle2, CircleDot, Inbox, LineChart, Sparkles, Workflow } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from '../components/Link.tsx'
import { Reveal } from '../components/motion/Reveal.tsx'
import { Tabs } from '../components/ui/primitives.tsx'
import { Container, SectionHeader } from './Section.tsx'

type StepId = 'capture' | 'plan' | 'automate' | 'measure'
const steps: { id: StepId; n: string; label: string; title: string; body: string; points: string[]; to: string; cta: string; visual: ReactNode }[] = [
  {
    id: 'capture',
    n: '01',
    label: 'Capture',
    title: 'Every request lands in one place',
    body: 'Briefs, emails and chat requests become structured work. The assistant pulls out the deliverables, dates and owners, so nothing sits forgotten in an inbox.',
    points: ['Intake forms and email forwarding', 'AI extraction of scope and deadlines', 'Duplicate and conflict detection'],
    to: '/app/assistant',
    cta: 'Try the assistant',
    visual: (
      <div className="space-y-2">
        {['Brief: Lumen storefront refresh', 'Email: Orbit — payment provider change', 'Chat: Need print specs by Friday'].map((t, i) => (
          <div key={t} className="flex items-center gap-3 rounded-lg border border-line bg-bg-deep/60 px-3 py-2.5 text-sm">
            <Inbox className="size-4 text-brand-text" />
            <span className="min-w-0 flex-1 truncate">{t}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${i === 0 ? 'bg-violet/15 text-violet-text' : 'bg-white/5 text-faint'}`}>{i === 0 ? 'AI parsed' : 'New'}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'plan',
    n: '02',
    label: 'Plan',
    title: 'Plans that adjust as work moves',
    body: 'Projects break down into tasks with owners and dates. When something slips, Nexa shows what it affects and suggests how to rebalance the work.',
    points: ['Board and list views with filters', 'Workload per person', 'Risk flags before deadlines are missed'],
    to: '/app/projects',
    cta: 'Open projects',
    visual: (
      <div className="space-y-2">
        {[
          ['Payments: declined cards', 'Leo', 'Urgent', 'text-danger'],
          ['Calendar sync timezone bug', 'Jonah', 'High', 'text-warning'],
          ['Class booking empty states', 'Jonah', 'Medium', 'text-muted'],
        ].map(([t, who, p, c]) => (
          <div key={t} className="flex items-center gap-3 rounded-lg border border-line bg-bg-deep/60 px-3 py-2.5 text-sm">
            <CircleDot className="size-4 text-faint" />
            <span className="min-w-0 flex-1 truncate">{t}</span>
            <span className="hidden text-xs text-faint sm:inline">{who}</span>
            <span className={`text-xs ${c}`}>{p}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'automate',
    n: '03',
    label: 'Automate',
    title: 'Hand repeat work to flows',
    body: 'Status digests, approvals, invoices and handoffs run on triggers you define. Every flow can be paused, tested and audited.',
    points: ['Visual flow builder or plain-language drafting', 'Test runs before going live', 'Per-flow time-saved tracking'],
    to: '/app/automations',
    cta: 'Explore automations',
    visual: (
      <div className="space-y-2">
        {[
          ['Review ready → notify approver', true],
          ['Weekly client status digest', true],
          ['Overdue task triage', false],
        ].map(([t, on]) => (
          <div key={t as string} className="flex items-center gap-3 rounded-lg border border-line bg-bg-deep/60 px-3 py-2.5 text-sm">
            <Workflow className="size-4 text-violet-text" />
            <span className="min-w-0 flex-1 truncate">{t}</span>
            <span className={`relative h-5 w-9 rounded-full ${on ? 'bg-brand-strong' : 'bg-surface-3'}`}>
              <span className={`absolute top-0.5 size-4 rounded-full bg-text ${on ? 'left-[18px]' : 'left-0.5'}`} />
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'measure',
    n: '04',
    label: 'Measure',
    title: 'Know what is working',
    body: 'Live analytics show throughput, cycle time and the hours your automations give back, broken down by project, person and period.',
    points: ['Period comparisons', 'Automation impact reporting', 'Exportable data tables'],
    to: '/app/analytics',
    cta: 'See analytics',
    visual: (
      <div className="grid grid-cols-2 gap-2">
        {[
          [LineChart, 'Throughput', '+18%'],
          [CalendarClock, 'Cycle time', '3.4d'],
          [Sparkles, 'Automated', '41%'],
          [CheckCircle2, 'On time', '94%'],
        ].map(([Icon, l, v]) => {
          const I = Icon as typeof LineChart
          return (
            <div key={l as string} className="rounded-lg border border-line bg-bg-deep/60 p-3">
              <I className="size-4 text-cyan" />
              <div className="mt-2 text-xs text-faint">{l as string}</div>
              <div className="font-display text-xl font-semibold">{v as string}</div>
            </div>
          )
        })}
      </div>
    ),
  },
]

export function Walkthrough() {
  const [tab, setTab] = useState<StepId>('capture')
  const s = steps.find((x) => x.id === tab)!
  return (
    <section id="walkthrough" aria-labelledby="walkthrough-title" className="scroll-mt-20 py-18 lg:py-22">
      <Container>
        <SectionHeader
          id="walkthrough-title"
          eyebrow="How it works"
          title="From request to result in four steps."
          lead="Follow one piece of work through Nexa, then open the same screen in the live demo."
        />
        <Reveal delay={0.05} className="mt-12">
          <Tabs
            idBase="walk"
            label="Product walkthrough steps"
            value={tab}
            onChange={setTab}
            items={steps.map((x) => ({
              id: x.id,
              label: (
                <>
                  <span className="font-mono text-xs text-faint">{x.n}</span> {x.label}
                </>
              ),
            }))}
          />
          <div id="walk-panel" role="tabpanel" aria-labelledby={`walk-tab-${tab}`} tabIndex={0} className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-2 lg:items-center">
            <div key={s.id} className="fade-up">
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
              <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">{s.body}</p>
              <ul className="mt-6 space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-cyan" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link to={s.to} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-brand-text hover:text-text">
                {s.cta} in the live demo <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div key={`${s.id}-v`} aria-hidden="true" className="fade-up panel p-5 sm:p-6" style={{ animationDelay: '0.08s' }}>
              {s.visual}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
