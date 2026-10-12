import { useState, type FormEvent } from 'react'
import { Button, Dialog } from '../components/ui/index.ts'
import { people, projects, type Priority } from './data.ts'
import { PRIORITY } from './labels.ts'
import { useStore } from './store.ts'
import { useToast } from './toast.ts'
import { Field, inputClass } from './ui.tsx'

const DUE = [
  { v: 0, l: 'Today' },
  { v: 1, l: 'Tomorrow' },
  { v: 3, l: 'In 3 days' },
  { v: 7, l: 'Next week' },
  { v: 14, l: 'In two weeks' },
]

export function NewTaskDialog({ open, onClose, defaultProject }: { open: boolean; onClose: () => void; defaultProject?: string }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const [error, setError] = useState('')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title') ?? '').trim()
    if (title.length < 3) {
      setError('Give the task a title of at least 3 characters.')
      return
    }
    dispatch({
      type: 'task/add',
      title,
      projectId: String(f.get('project')),
      assignee: String(f.get('assignee')),
      priority: String(f.get('priority')) as Priority,
      dueInDays: Number(f.get('due')),
    })
    setError('')
    onClose()
    toast(`Task “${title}” created`)
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setError('')
        onClose()
      }}
      title="New task"
      description="Added to this demo workspace and saved in your browser only."
    >
      <form id="new-task" onSubmit={submit} noValidate className="grid gap-4">
        <Field label="Title">
          <input
            name="title"
            className={inputClass}
            placeholder="e.g. Prepare launch checklist"
            aria-invalid={!!error}
            aria-describedby={error ? 'new-task-error' : undefined}
            autoComplete="off"
          />
        </Field>
        {error && (
          <p id="new-task-error" role="alert" className="-mt-2 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project">
            <select name="project" defaultValue={defaultProject ?? projects[0].id} className={inputClass}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assignee">
            <select name="assignee" defaultValue="maya" className={inputClass}>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select name="priority" defaultValue="medium" className={inputClass}>
              {(Object.keys(PRIORITY) as Priority[]).map((k) => (
                <option key={k} value={k}>
                  {PRIORITY[k].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due">
            <select name="due" defaultValue="3" className={inputClass}>
              {DUE.map((d) => (
                <option key={d.v} value={d.v}>
                  {d.l}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-brand-strong px-5 text-[0.95rem] font-medium text-white hover:bg-brand-deep">
            Create task
          </button>
        </div>
      </form>
    </Dialog>
  )
}
