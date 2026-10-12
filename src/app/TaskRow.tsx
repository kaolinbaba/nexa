import { Sparkles } from 'lucide-react'
import { Avatar, Badge } from '../components/ui/index.ts'
import type { Task, TaskStatus } from './data.ts'
import { dueLabel, person, PRIORITY, projectById, TASK_STATUS } from './labels.ts'
import { useStore } from './store.ts'
import { useToast } from './toast.ts'

/** Native <select> keeps status changes keyboard- and screen-reader-friendly on every device. */
export function StatusSelect({ task, compact }: { task: Task; compact?: boolean }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const tone = { todo: 'text-muted', 'in-progress': 'text-brand-text', review: 'text-violet-text', done: 'text-success' }[task.status]
  return (
    <select
      aria-label={`Status of “${task.title}”`}
      value={task.status}
      onChange={(e) => {
        const status = e.target.value as TaskStatus
        dispatch({ type: 'task/status', id: task.id, status })
        toast(`Moved to ${TASK_STATUS.find((s) => s.id === status)!.label}`)
      }}
      className={`cursor-pointer rounded-md border font-medium ${tone} hover:border-faint/50 ${
        compact ? 'min-h-8 w-full border-line bg-transparent pl-2 pr-6 text-xs' : 'min-h-9 border-line-strong bg-bg-deep pl-2.5 pr-7 text-sm'
      }`}
    >
      {TASK_STATUS.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  )
}

export function TaskRow({ task, showProject = true }: { task: Task; showProject?: boolean }) {
  const who = person(task.assignee)
  const pr = PRIORITY[task.priority]
  const overdue = task.status !== 'done' && task.dueInDays < 0
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:px-5">
      <div className="min-w-0">
        <p className={`flex items-center gap-2 text-sm font-medium ${task.status === 'done' ? 'text-muted line-through decoration-faint' : ''}`}>
          <span className="truncate">{task.title}</span>
          {task.automated && (
            <span title="Created or updated by an automation" className="shrink-0 text-violet-text">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span className="sr-only">(automated)</span>
            </span>
          )}
        </p>
        <p className="mt-0.5 truncate text-xs text-faint">
          {showProject && <>{projectById(task.projectId)?.name ?? 'Project'} · </>}
          <span className={overdue ? 'text-danger' : ''}>{overdue ? `Overdue · ${dueLabel(task.dueInDays)}` : dueLabel(task.dueInDays)}</span>
        </p>
      </div>
      <span className="hidden sm:block">
        <Badge tone={pr.tone}>{pr.label}</Badge>
      </span>
      <span className="hidden sm:block">
        <Avatar name={who.name} hue={who.hue} size={28} />
      </span>
      <StatusSelect task={task} />
    </li>
  )
}
