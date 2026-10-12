import { Clock, Gauge, Sparkles, Table2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { AreaChart } from '../../components/charts/AreaChart.tsx'
import { Avatar, Tabs } from '../../components/ui/index.ts'
import { fmt } from '../../lib/chart.ts'
import { PERIODS, people, projects, seriesFor, summaryFor, type Period } from '../data.ts'
import { TASK_STATUS } from '../labels.ts'
import { useStore } from '../store.ts'
import { Card, PageHeader, Stat } from '../ui.tsx'

const statusColor = { todo: 'bg-faint/60', 'in-progress': 'bg-brand', review: 'bg-violet', done: 'bg-success' }

export function Analytics() {
  const { state } = useStore()
  const [period, setPeriod] = useState<Period>('30d')
  const [table, setTable] = useState(false)
  const data = seriesFor(period)
  const sum = summaryFor(period)
  const cfg = PERIODS.find((p) => p.id === period)!

  const byProject = projects.map((p) => {
    const ts = state.tasks.filter((t) => t.projectId === p.id)
    return { p, total: ts.length, parts: TASK_STATUS.map((s) => ({ s, n: ts.filter((t) => t.status === s.id).length })) }
  })
  const maxProject = Math.max(1, ...byProject.map((x) => x.total))
  const workload = people.map((pp) => ({ pp, n: state.tasks.filter((t) => t.assignee === pp.id && t.status !== 'done').length })).sort((a, b) => b.n - a.n)
  const maxLoad = Math.max(1, ...workload.map((w) => w.n))
  const impact = state.automations
    .map((a) => ({ a, h: Math.round((a.runs30d * a.minutesSavedPerRun) / 6) / 10 }))
    .sort((x, y) => y.h - x.h)
  const maxImpact = Math.max(1, ...impact.map((i) => i.h))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Throughput, cycle time and automation impact for the demo workspace."
        actions={<Tabs idBase="an-period" label="Analytics period" variant="segmented" value={period} onChange={setPeriod} items={PERIODS.map((p) => ({ id: p.id, label: p.label }))} />}
      />

      <div id="an-period-panel" role="tabpanel" aria-labelledby={`an-period-tab-${period}`} className="space-y-6">
        <div data-tour="analytics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat label="Tasks completed" value={fmt.format(sum.completed)} note={`${sum.trend >= 0 ? '+' : ''}${sum.trend}% vs. first half of period`} icon={<TrendingUp className="size-4" />} />
          <Stat label="Automated" value={fmt.format(sum.automated)} note={`${Math.round((sum.automated / sum.completed) * 100)}% of completed work`} icon={<Sparkles className="size-4" />} accent="text-violet-text" />
          <Stat label="Hours saved" value={`${fmt.format(sum.hoursSaved)}h`} note="≈14 min per automated task" icon={<Clock className="size-4" />} accent="text-cyan" />
          <Stat label="Avg. cycle time" value={`${sum.cycleDays} days`} note="Brief to delivery" icon={<Gauge className="size-4" />} accent="text-warning" />
        </div>

        <Card
          id="an-throughput"
          title={`Throughput · ${cfg.label}`}
          action={
            <button
              type="button"
              aria-expanded={table}
              aria-controls="an-table"
              onClick={() => setTable((v) => !v)}
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-muted hover:text-text"
            >
              <Table2 className="size-4" aria-hidden="true" /> {table ? 'Hide' : 'Show'} data table
            </button>
          }
        >
          <div className="mb-4 flex items-center gap-5 text-sm text-muted">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-4 rounded bg-brand" /> Completed
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-4 border-t-2 border-dashed border-violet" /> Automated
            </span>
          </div>
          <AreaChart
            data={data}
            height={300}
            summary={`Completed versus automated tasks per ${cfg.unit} over ${cfg.label}. Use arrow keys to inspect, or show the data table.`}
            series={[
              { key: 'completed', label: 'Completed', color: 'var(--color-brand)', fill: true },
              { key: 'automated', label: 'Automated', color: 'var(--color-violet-text)', dashed: true },
            ]}
          />
          {table && (
            <div id="an-table" className="mt-5 max-h-72 overflow-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Throughput data, {cfg.label}</caption>
                <thead className="sticky top-0 bg-surface-3 text-xs text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      {cfg.unit === 'month' ? 'Month' : cfg.unit === 'week' ? 'Week of' : 'Day'}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">
                      Completed
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">
                      Automated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono">
                  {data.map((d) => (
                    <tr key={d.label}>
                      <th scope="row" className="px-4 py-2 font-sans font-normal text-muted">
                        {d.label}
                      </th>
                      <td className="px-4 py-2 text-right">{d.completed}</td>
                      <td className="px-4 py-2 text-right">{d.automated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card id="an-projects" title="Tasks by project" className="xl:col-span-2">
          <ul className="space-y-4">
            {byProject.map(({ p, total, parts }) => (
              <li key={p.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono text-xs text-faint">{total} tasks</span>
                </div>
                <div
                  className="flex h-2.5 overflow-hidden rounded-full bg-line"
                  style={{ width: `${Math.max(8, (total / maxProject) * 100)}%` }}
                  role="img"
                  aria-label={`${p.name}: ${parts.map((x) => `${x.n} ${x.s.label}`).join(', ')}`}
                >
                  {parts.map((x) => (x.n ? <span key={x.s.id} className={`${statusColor[x.s.id]} h-full border-r border-bg last:border-r-0`} style={{ flexGrow: x.n }} /> : null))}
                </div>
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted" aria-label="Legend">
            {TASK_STATUS.map((s) => (
              <li key={s.id} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`size-2 rounded-full ${statusColor[s.id]}`} />
                {s.label}
              </li>
            ))}
          </ul>
        </Card>

        <Card id="an-workload" title="Open work by person">
          <ul className="space-y-3.5">
            {workload.map(({ pp, n }) => (
              <li key={pp.id} className="flex items-center gap-3">
                <Avatar name={pp.name} hue={pp.hue} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{pp.name}</span>
                    <span className="font-mono text-xs text-muted">{n}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-line">
                    <div className={`h-full rounded-full ${n >= 4 ? 'bg-warning' : 'bg-cyan'}`} style={{ width: `${(n / maxLoad) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-faint">Amber marks people with 4+ open tasks.</p>
        </Card>
      </div>

      <Card id="an-impact" title="Automation impact · last 30 days">
        <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          {impact.map(({ a, h }) => (
            <li key={a.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{a.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">{h ? `${h}h saved` : a.enabled ? 'no runs yet' : 'paused'}</span>
              </div>
              <div className="h-1.5 rounded-full bg-line">
                <div className="h-full rounded-full bg-linear-to-r from-violet to-brand" style={{ width: `${(h / maxImpact) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <p className="text-xs text-faint">All figures are generated demo data for a fictional workspace.</p>
    </div>
  )
}
