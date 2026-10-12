import { CalendarDays, Plus, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from '../../components/Link.tsx'
import { Avatar, Badge, Button, Tabs } from '../../components/ui/index.ts'
import { setParam, useLocation } from '../../lib/router.ts'
import { projects, type ProjectStatus } from '../data.ts'
import { dueLabel, person, PROJECT_STATUS } from '../labels.ts'
import { NewTaskDialog } from '../NewTaskDialog.tsx'
import { useStore } from '../store.ts'
import { TaskRow } from '../TaskRow.tsx'
import { PageHeader } from '../ui.tsx'

type Filter = 'all' | ProjectStatus
const accentBar = { brand: 'bg-brand', violet: 'bg-violet', cyan: 'bg-cyan' }

function Ring({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-line)" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="url(#ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--color-brand)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Projects() {
  const { state } = useStore()
  const { search } = useLocation()
  const [filter, setFilter] = useState<Filter>('all')
  const [newTask, setNewTask] = useState(false)
  const detailRef = useRef<HTMLElement>(null)
  const selectedId = search.get('p') ?? projects[0].id
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0]

  const counts = (s: Filter) => (s === 'all' ? projects.length : projects.filter((p) => p.status === s).length)
  const list = filter === 'all' ? projects : projects.filter((p) => p.status === filter)
  const tasks = state.tasks.filter((t) => t.projectId === selected.id)
  const done = tasks.filter((t) => t.status === 'done').length
  const progress = selected.progress

  const select = (id: string) => {
    setParam('p', id)
    if (window.matchMedia('(max-width: 1279px)').matches) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Select a project to see its tasks, team and progress. Status changes are saved in this browser." />

      <Tabs
        idBase="proj-filter"
        label="Filter projects by status"
        value={filter}
        onChange={setFilter}
        items={(['all', 'on-track', 'at-risk', 'blocked', 'done'] as Filter[]).map((f) => ({ id: f, label: f === 'all' ? 'All' : PROJECT_STATUS[f].label, count: counts(f) }))}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_1.05fr]">
        <div id="proj-filter-panel" role="tabpanel" aria-labelledby={`proj-filter-tab-${filter}`}>
          <ul data-tour="projects" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {list.map((p) => {
              const active = p.id === selected.id
              const open = state.tasks.filter((t) => t.projectId === p.id && t.status !== 'done').length
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => select(p.id)}
                    className={`group relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border p-5 text-left transition-colors duration-200 ${
                      active ? 'border-brand/50 bg-brand/[0.06]' : 'border-line bg-surface-2 hover:border-line-strong hover:bg-surface-3/60'
                    }`}
                  >
                    <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-0.5 ${accentBar[p.accent]} ${active ? 'opacity-100' : 'opacity-40'}`} />
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{p.name}</span>
                        <span className="block truncate text-xs text-faint">{p.client}</span>
                      </span>
                      <Badge tone={PROJECT_STATUS[p.status].tone} dot>
                        {PROJECT_STATUS[p.status].label}
                      </Badge>
                    </span>
                    <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-line">
                      <span className={`block h-full rounded-full ${accentBar[p.accent]}`} style={{ width: `${p.progress}%` }} />
                    </span>
                    <span className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span>
                        {open} open · {p.progress}%
                      </span>
                      <span className="flex -space-x-1">
                        {p.members.map((m) => {
                          const pp = person(m)
                          return <Avatar key={m} name={pp.name} hue={pp.hue} size={26} />
                        })}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          {list.length === 0 && <p className="panel p-8 text-center text-sm text-muted">No projects with this status.</p>}
        </div>

        <section ref={detailRef} aria-labelledby="proj-detail" className="panel scroll-mt-24 overflow-hidden xl:sticky xl:top-24">
          <div className="border-b border-line p-6">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <Ring value={progress} />
                <span className="absolute inset-0 grid place-items-center font-mono text-sm">{progress}%</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="proj-detail" className="font-display text-xl font-semibold tracking-tight">
                    {selected.name}
                  </h2>
                  <Badge tone={PROJECT_STATUS[selected.status].tone} dot>
                    {PROJECT_STATUS[selected.status].label}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{selected.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-faint">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" /> Due {dueLabel(selected.dueInDays).toLowerCase()}
                  </span>
                  <span>Lead: {person(selected.lead).name}</span>
                  <span>{selected.client}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setNewTask(true)}>
                <Plus className="size-4" aria-hidden="true" /> Add task
              </Button>
              <Link to="/app/assistant?ask=status" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-violet/35 bg-violet/10 px-3.5 text-sm font-medium text-violet-text hover:bg-violet/15">
                <Sparkles className="size-4" aria-hidden="true" /> Draft status update
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 pt-4 text-sm">
            <h3 className="font-medium">Tasks</h3>
            <span className="text-xs text-faint">
              {done}/{tasks.length} done
            </span>
          </div>
          <ul className="divide-y divide-line">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} showProject={false} />
            ))}
            {tasks.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted">No tasks yet.</li>}
          </ul>
          <div className="border-t border-line px-5 py-4">
            <h3 className="text-xs font-medium text-faint">Team</h3>
            <ul className="mt-3 flex flex-wrap gap-4">
              {selected.members.map((m) => {
                const pp = person(m)
                return (
                  <li key={m} className="flex items-center gap-2.5">
                    <Avatar name={pp.name} hue={pp.hue} size={30} />
                    <span className="text-sm">
                      <span className="block">{pp.name}</span>
                      <span className="block text-xs text-faint">{pp.role}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>

      <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} defaultProject={selected.id} />
    </div>
  )
}
