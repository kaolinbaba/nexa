import { ArrowUpRight, Clock, Gauge, Sparkles, TrendingUp } from 'lucide-react'
import { automations } from '../app/data.ts'
import { useState } from 'react'
import { PERIODS, seriesFor, summaryFor, type Period } from '../app/data.ts'
import { AreaChart } from '../components/charts/AreaChart.tsx'
import { Reveal } from '../components/motion/Reveal.tsx'
import { Tabs } from '../components/ui/primitives.tsx'
import { fmt } from '../lib/chart.ts'
import { Container, SectionHeader } from './Section.tsx'

export function AnalyticsSection() {
  const [period, setPeriod] = useState<Period>('30d')
  const data = seriesFor(period)
  const sum = summaryFor(period)
  const kpis = [
    { icon: TrendingUp, label: 'Tasks completed', value: fmt.format(sum.completed), note: `${sum.trend >= 0 ? '+' : ''}${sum.trend}% vs. first half` },
    { icon: Sparkles, label: 'Handled by automations', value: fmt.format(sum.automated), note: `${Math.round((sum.automated / sum.completed) * 100)}% of all work` },
    { icon: Clock, label: 'Hours saved', value: `${fmt.format(sum.hoursSaved)}h`, note: 'at ~14 min per automated task' },
    { icon: Gauge, label: 'Avg. cycle time', value: `${sum.cycleDays}d`, note: 'brief to delivery' },
  ]

  return (
    <section id="analytics" aria-labelledby="analytics-title" className="scroll-mt-20 py-18 lg:py-22">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            id="analytics-title"
            eyebrow="Business analytics"
            accent="cyan"
            title="See where the time goes, and how much you get back."
            lead="Throughput, cycle time and automation impact are tracked live from the work itself. You never have to build a report by hand."
          />
          <Reveal>
            <Tabs idBase="mk-period" label="Analytics period" variant="segmented" value={period} onChange={setPeriod} items={PERIODS.map((p) => ({ id: p.id, label: p.label }))} />
          </Reveal>
        </div>

        {/* Layered composition: the live panel with two product cards floating over its corners (lg+). */}
        <div className="relative mt-12 lg:mt-20 lg:mb-10">
        <Reveal delay={0.05} className="panel overflow-hidden">
          <div id="mk-period-panel" role="tabpanel" aria-labelledby={`mk-period-tab-${period}`} className="grid lg:grid-cols-[280px_1fr]">
            <dl className="grid grid-cols-2 gap-px border-b border-line bg-line lg:grid-cols-1 lg:border-b-0 lg:border-r">
              {kpis.map(({ icon: Icon, label, value, note }) => (
                <div key={label} className="bg-surface-2 p-5">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Icon className="size-4 text-cyan" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-2 font-display text-[1.75rem] font-semibold leading-none tracking-tight">{value}</dd>
                  <dd className="mt-2 text-xs text-faint">{note}</dd>
                </div>
              ))}
            </dl>
            <div className="min-w-0 p-5 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mb-16">
                <h3 className="font-medium">Throughput · {PERIODS.find((p) => p.id === period)!.label}</h3>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-0.5 w-4 rounded bg-brand" /> Completed
                  </span>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-0.5 w-4 rounded border-t-2 border-dashed border-violet" /> Automated
                  </span>
                </div>
              </div>
              <AreaChart
                data={data}
                height={280}
                summary={`Line chart of tasks completed versus automated over ${period}. ${fmt.format(sum.completed)} completed, ${fmt.format(sum.automated)} automated. Use left and right arrow keys to inspect values.`}
                series={[
                  { key: 'completed', label: 'Completed', color: 'var(--color-brand)', fill: true },
                  { key: 'automated', label: 'Automated', color: 'var(--color-violet-text)', dashed: true },
                ]}
              />
              <p className="mt-4 flex items-center gap-1.5 text-xs text-faint lg:justify-end">
                <ArrowUpRight className="size-3.5" aria-hidden="true" /> Demo data for a fictional workspace. Hover or use the arrow keys on the chart to inspect values.
              </p>
            </div>
          </div>
        </Reveal>
        <FloatingCards />
        </div>
      </Container>
    </section>
  )
}

const SHORT: Record<string, string> = { a1: 'Project kickoff', a2: 'Client digest', a3: 'Approvals', a5: 'Invoicing' }

function FloatingCards() {
  const top = [...automations]
    .filter((a) => a.runs30d > 0)
    .map((a) => ({ name: SHORT[a.id] ?? a.name, h: Math.round((a.runs30d * a.minutesSavedPerRun) / 60) }))
    .sort((a, b) => b.h - a.h)
    .slice(0, 3)
  const max = top[0]?.h || 1
  return (
    <div aria-hidden="true" className="pointer-events-none hidden lg:block">
      <div className="float-card absolute -top-10 right-8 w-[272px] rounded-2xl border border-line-strong bg-surface/90 p-4 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.95)] backdrop-blur-md">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-text">Automation impact</span>
          <span className="font-mono text-faint">30d</span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {top.map((t, i) => (
            <li key={t.name}>
              <div className="flex justify-between text-xs">
                <span className="truncate text-muted">{t.name}</span>
                <span className="font-mono text-text">{t.h}h</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-line">
                <div className={`h-full rounded-full ${i === 0 ? 'bg-linear-to-r from-violet to-brand' : 'bg-brand/70'}`} style={{ width: `${(t.h / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="float-card absolute -bottom-10 left-[300px] flex w-[340px] items-center gap-3 rounded-2xl border border-violet/30 bg-surface/90 p-3.5 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.95)] backdrop-blur-md" style={{ animationDelay: '-3s' }}>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-text">
          <Sparkles className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-text">Weekly client digest drafted</span>
          <span className="block truncate text-xs text-faint">AI summary of 6 projects</span>
        </span>
        <span className="rounded-md border border-line-strong px-2 py-1 text-xs text-text">Review</span>
      </div>
    </div>
  )
}
