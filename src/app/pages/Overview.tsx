import { AlertTriangle, ArrowRight, Bot, CheckCircle2, Clock, ListChecks, Sparkles, Workflow, Zap } from 'lucide-react'
import { useState } from 'react'
import { AreaChart } from '../../components/charts/AreaChart.tsx'
import { Link } from '../../components/Link.tsx'
import { Avatar, Badge, Tabs } from '../../components/ui/index.ts'
import { fmt } from '../../lib/chart.ts'
import { projects, seriesFor, summaryFor, type Period } from '../data.ts'
import { agoLabel, dueLabel, person, PRIORITY, PROJECT_STATUS, projectById } from '../labels.ts'
import { useStore } from '../store.ts'
import { Card, PageHeader, Stat } from '../ui.tsx'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Overview() {
  const { state } = useStore()
  const [period, setPeriod] = useState<Period>('30d')
  const open = state.tasks.filter((t) => t.status !== 'done')
  const dueWeek = open.filter((t) => t.dueInDays <= 7)
  const overdue = open.filter((t) => t.dueInDays < 0)
  const live = state.automations.filter((a) => a.enabled)
  const hours = Math.round(state.automations.reduce((s, a) => s + a.runs30d * a.minutesSavedPerRun, 0) / 60)
  const attention = [
    ...projects.filter((p) => p.status === 'at-risk' || p.status === 'blocked').map((p) => ({ kind: 'project' as const, p })),
    ...open
      .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.dueInDays <= 2)
      .sort((a, b) => PRIORITY[a.priority].rank - PRIORITY[b.priority].rank)
      .slice(0, 3)
      .map((t) => ({ kind: 'task' as const, t })),
  ]
  const sum = summaryFor(period)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, Maya`}
        description={
          <>
            Here’s what’s happening across Atlas &amp; Pine. {attention.length} items need your attention.
          </>
        }
        actions={
          <Link to="/app/assistant" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-violet/35 bg-violet/10 px-3.5 text-sm font-medium text-violet-text hover:bg-violet/15">
            <Sparkles className="size-4" aria-hidden="true" /> Ask Nexa
          </Link>
        }
      />

      <div data-tour="kpis" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label="Open tasks" value={open.length} note={`${overdue.length} overdue · ${dueWeek.length} due this week`} icon={<ListChecks className="size-4" />} />
        <Stat label="Due this week" value={dueWeek.length} note={`${dueWeek.filter((t) => t.priority === 'urgent' || t.priority === 'high').length} high priority`} icon={<Clock className="size-4" />} accent="text-warning" />
        <Stat label="Live automations" value={`${live.length}/${state.automations.length}`} note={`${fmt.format(live.reduce((s, a) => s + a.runs30d, 0))} runs in 30 days`} icon={<Zap className="size-4" />} accent="text-violet-text" />
        <Stat label="Hours saved" value={`${hours}h`} note="last 30 days, from automations" icon={<CheckCircle2 className="size-4" />} accent="text-cyan" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card
          id="ov-throughput"
          title="Throughput"
          action={<Tabs idBase="ov-period" label="Chart period" variant="segmented" value={period} onChange={setPeriod} items={[{ id: '7d', label: '7d' }, { id: '30d', label: '30d' }, { id: '90d', label: '90d' }]} />}
        >
          <div id="ov-period-panel" role="tabpanel" aria-labelledby={`ov-period-tab-${period}`}>
            <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span className="text-muted">
                Completed <span className="ml-1 font-mono text-text">{fmt.format(sum.completed)}</span>
              </span>
              <span className="text-muted">
                Automated <span className="ml-1 font-mono text-text">{fmt.format(sum.automated)}</span>
              </span>
              <span className={sum.trend >= 0 ? 'text-success' : 'text-danger'}>
                {sum.trend >= 0 ? '▲' : '▼'} {Math.abs(sum.trend)}% vs. first half
              </span>
            </div>
            <AreaChart
              data={seriesFor(period)}
              height={230}
              summary={`Tasks completed and automated over ${period}.`}
              series={[
                { key: 'completed', label: 'Completed', color: 'var(--color-brand)', fill: true },
                { key: 'automated', label: 'Automated', color: 'var(--color-violet-text)', dashed: true },
              ]}
            />
          </div>
        </Card>

        <Card id="ov-attention" title="Needs attention" action={<Badge tone="warning">{attention.length}</Badge>} bodyClass="p-2">
          <ul className="divide-y divide-line">
            {attention.map((a) =>
              a.kind === 'project' ? (
                <li key={a.p.id}>
                  <Link to={`/app/projects?p=${a.p.id}`} className="flex min-h-14 items-start gap-3 rounded-lg px-3 py-3 hover:bg-white/[0.03]">
                    <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${a.p.status === 'blocked' ? 'text-danger' : 'text-warning'}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{a.p.name}</span>
                      <span className="block text-xs text-muted">{a.p.summary}</span>
                    </span>
                    <Badge tone={PROJECT_STATUS[a.p.status].tone}>{PROJECT_STATUS[a.p.status].label}</Badge>
                  </Link>
                </li>
              ) : (
                <li key={a.t.id}>
                  <Link to={`/app/tasks?q=${encodeURIComponent(a.t.title)}`} className="flex min-h-14 items-start gap-3 rounded-lg px-3 py-3 hover:bg-white/[0.03]">
                    <Clock className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{a.t.title}</span>
                      <span className="block text-xs text-muted">
                        {projectById(a.t.projectId)?.name} · {dueLabel(a.t.dueInDays)}
                      </span>
                    </span>
                    <Badge tone={PRIORITY[a.t.priority].tone}>{PRIORITY[a.t.priority].label}</Badge>
                  </Link>
                </li>
              ),
            )}
            {attention.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">All clear. Nothing urgent right now.</li>}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card id="ov-projects" title="Active projects" action={<Link to="/app/projects" className="inline-flex min-h-9 items-center gap-1 text-sm text-brand-text hover:text-text">All projects <ArrowRight className="size-3.5" aria-hidden="true" /></Link>} bodyClass="p-2">
          <ul>
            {projects
              .filter((p) => p.status !== 'done')
              .map((p) => {
                const left = state.tasks.filter((t) => t.projectId === p.id && t.status !== 'done').length
                return (
                  <li key={p.id}>
                    <Link to={`/app/projects?p=${p.id}`} className="block rounded-lg px-3 py-3 hover:bg-white/[0.03]">
                      <span className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{p.name}</span>
                        <span className="shrink-0 font-mono text-xs text-muted">{p.progress}%</span>
                      </span>
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
                        <span className={`block h-full rounded-full ${p.accent === 'violet' ? 'bg-violet' : p.accent === 'cyan' ? 'bg-cyan' : 'bg-brand'}`} style={{ width: `${p.progress}%` }} />
                      </span>
                      <span className="mt-1.5 block text-xs text-faint">
                        {left} open tasks · due {dueLabel(p.dueInDays).toLowerCase()}
                      </span>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </Card>

        <Card id="ov-activity" title="Activity" bodyClass="p-2">
          <ol>
            {state.activity.slice(0, 6).map((e) => {
              const who = e.who === 'automation' ? null : e.who === 'ai' ? null : person(e.who === 'you' ? 'maya' : e.who)
              return (
                <li key={e.id} className="flex gap-3 rounded-lg px-3 py-2.5">
                  {who ? (
                    <Avatar name={who.name} hue={who.hue} size={28} />
                  ) : (
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full ${e.who === 'ai' ? 'bg-violet/15 text-violet-text' : 'bg-cyan/10 text-cyan'}`}>
                      {e.who === 'ai' ? <Bot className="size-3.5" aria-hidden="true" /> : <Workflow className="size-3.5" aria-hidden="true" />}
                    </span>
                  )}
                  <p className="min-w-0 text-sm leading-snug text-muted">
                    <span className="font-medium text-text">{who ? (e.who === 'you' ? 'You' : who.name.split(' ')[0]) : e.who === 'ai' ? 'Nexa AI' : 'Automation'}</span> {e.text}
                    <span className="mt-0.5 block text-xs text-faint">{agoLabel(e.minutesAgo)}</span>
                  </p>
                </li>
              )
            })}
          </ol>
        </Card>

        <section aria-labelledby="ov-insight" className="relative overflow-hidden rounded-[var(--radius-card)] border border-violet/30 bg-linear-to-b from-violet/[0.12] to-surface-2 p-6 lg:col-span-2 xl:col-span-1">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-violet/25 blur-3xl" />
          <p className="relative flex items-center gap-2 text-sm font-medium text-violet-text">
            <Sparkles className="size-4" aria-hidden="true" /> Nexa suggests
          </p>
          <h2 id="ov-insight" className="relative mt-3 font-display text-xl font-semibold tracking-tight">
            Turn on “Overdue task triage”
          </h2>
          <p className="relative mt-2 text-sm leading-relaxed text-muted">
            {overdue.length > 0 ? `${overdue.length} tasks are overdue right now.` : 'Overdue work tends to pile up mid-sprint.'} This flow suggests new owners each morning and could save
            around 20 minutes a day.
          </p>
          <div className="relative mt-5 flex flex-wrap gap-2">
            <Link to="/app/automations?flow=a4" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-strong px-3.5 text-sm font-medium text-white hover:bg-violet-strong/85">
              Review flow <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/app/assistant" className="inline-flex min-h-10 items-center rounded-lg border border-line-strong px-3.5 text-sm text-text hover:bg-white/5">
              Ask why
            </Link>
          </div>
          <p className="relative mt-4 font-mono text-xs text-faint">Simulated suggestion · no AI model called</p>
        </section>
      </div>
    </div>
  )
}
