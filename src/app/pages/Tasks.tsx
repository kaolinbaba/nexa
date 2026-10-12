import { FilterX, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar, Badge, Button, Tabs } from '../../components/ui/index.ts'
import { useLocation } from '../../lib/router.ts'
import { people, projects, type Priority, type Task } from '../data.ts'
import { dueLabel, person, PRIORITY, projectById, TASK_STATUS } from '../labels.ts'
import { NewTaskDialog } from '../NewTaskDialog.tsx'
import { useStore } from '../store.ts'
import { StatusSelect, TaskRow } from '../TaskRow.tsx'
import { inputClass, PageHeader } from '../ui.tsx'

type View = 'board' | 'list'
const colDot = { todo: 'bg-faint', 'in-progress': 'bg-brand', review: 'bg-violet', done: 'bg-success' }

function BoardCard({ task }: { task: Task }) {
  const who = person(task.assignee)
  const pr = PRIORITY[task.priority]
  const overdue = task.status !== 'done' && task.dueInDays < 0
  return (
    <li className="rounded-xl border border-line bg-surface-2 p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] transition-colors hover:border-line-strong">
      <p className="flex items-start gap-2 text-sm font-medium leading-snug">
        <span className="flex-1">{task.title}</span>
        {task.automated && (
          <span title="Created or updated by an automation" className="mt-0.5 text-violet-text">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(automated)</span>
          </span>
        )}
      </p>
      <p className="mt-1 truncate text-xs text-faint">{projectById(task.projectId)?.name}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Badge tone={pr.tone}>{pr.label}</Badge>
        <span className={`text-xs ${overdue ? 'text-danger' : 'text-muted'}`}>{dueLabel(task.dueInDays)}</span>
        <Avatar name={who.name} hue={who.hue} size={24} />
      </div>
      <div className="mt-3">
        <StatusSelect task={task} compact />
      </div>
    </li>
  )
}

export function Tasks() {
  const { state } = useStore()
  const { search } = useLocation()
  // Phones start in the list view; the 4-column board scrolls sideways there.
  const [view, setView] = useState<View>(() => (window.matchMedia('(max-width: 639px)').matches ? 'list' : 'board'))
  const [q, setQ] = useState(search.get('q') ?? '')
  const [project, setProject] = useState('all')
  const [assignee, setAssignee] = useState('all')
  const [priority, setPriority] = useState<'all' | Priority>('all')
  const [newTask, setNewTask] = useState(false)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return state.tasks
      .filter((t) => (term ? t.title.toLowerCase().includes(term) : true))
      .filter((t) => project === 'all' || t.projectId === project)
      .filter((t) => assignee === 'all' || t.assignee === assignee)
      .filter((t) => priority === 'all' || t.priority === priority)
      .sort((a, b) => PRIORITY[a.priority].rank - PRIORITY[b.priority].rank || a.dueInDays - b.dueInDays)
  }, [state.tasks, q, project, assignee, priority])

  const active = q || project !== 'all' || assignee !== 'all' || priority !== 'all'
  const clear = () => {
    setQ('')
    setProject('all')
    setAssignee('all')
    setPriority('all')
  }
  const selectClass = `${inputClass} min-h-10 w-full text-sm sm:w-auto`

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Filter, search and change status. Moving a task to Review runs the approver automation (simulated)."
      />

      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          idBase="task-view"
          label="Task view"
          variant="segmented"
          value={view}
          onChange={setView}
          items={[
            { id: 'board', label: 'Board' },
            { id: 'list', label: 'List' },
          ]}
        />
        <div role="group" aria-label="Filters" className="grid w-full gap-2 sm:flex sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          <label className="relative sm:w-56">
            <span className="sr-only">Search tasks</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className={`${inputClass} min-h-10 pl-9 text-sm`} />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <select aria-label="Filter by project" value={project} onChange={(e) => setProject(e.target.value)} className={`${selectClass} col-span-2`}>
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select aria-label="Filter by assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} className={selectClass}>
              <option value="all">Anyone</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value as 'all' | Priority)} className={selectClass}>
              <option value="all">Any priority</option>
              {(Object.keys(PRIORITY) as Priority[]).map((k) => (
                <option key={k} value={k}>
                  {PRIORITY[k].label}
                </option>
              ))}
            </select>
          </div>
          {active && (
            <Button variant="ghost" size="sm" onClick={clear}>
              <FilterX className="size-4" aria-hidden="true" /> Clear
            </Button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} tasks shown
      </p>

      <div id="task-view-panel" role="tabpanel" aria-labelledby={`task-view-tab-${view}`} data-tour="tasks">
        {view === 'board' ? (
          <div className="relative -mx-4 snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:px-0">
            <div className="grid min-w-[1040px] grid-cols-4 gap-4 xl:min-w-0">
              {TASK_STATUS.map((col) => {
                const items = filtered.filter((t) => t.status === col.id)
                return (
                  <section key={col.id} aria-labelledby={`col-${col.id}`} className="snap-start rounded-2xl border border-line bg-surface/60 p-3">
                    <h2 id={`col-${col.id}`} className="flex items-center gap-2 px-1.5 pb-3 pt-1 text-sm font-medium">
                      <span aria-hidden="true" className={`size-2 rounded-full ${colDot[col.id]}`} />
                      {col.label}
                      <span className="ml-auto font-mono text-xs text-faint">{items.length}</span>
                    </h2>
                    <ul className="space-y-2.5">
                      {items.map((t) => (
                        <BoardCard key={t.id} task={t} />
                      ))}
                      {items.length === 0 && <li className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-faint">Nothing here</li>}
                    </ul>
                  </section>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <ul className="divide-y divide-line">
              {filtered.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </ul>
            {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted">No tasks match these filters.</p>}
          </div>
        )}
      </div>

      <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} />
    </div>
  )
}
