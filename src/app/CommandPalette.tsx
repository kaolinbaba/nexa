import { CornerDownLeft, FolderKanban, ListChecks, Search, Workflow } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { navigate } from '../lib/router.ts'
import { projects } from './data.ts'
import { SECTIONS } from './labels.ts'
import { useStore } from './store.ts'

type Item = { id: string; group: string; label: string; hint?: string; icon: ReactNode; to: string }

/** ⌘K palette — ARIA combobox + listbox, arrow keys, Enter to go. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useStore()
  const ref = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const listId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      setQ('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    if (!open && d.open) d.close()
  }, [open])

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...SECTIONS.map((s) => ({ id: `s-${s.id}`, group: 'Go to', label: s.label, icon: <s.icon className="size-4" aria-hidden="true" />, to: `/app/${s.id}` })),
      ...projects.map((p) => ({ id: `p-${p.id}`, group: 'Projects', label: p.name, hint: p.client, icon: <FolderKanban className="size-4" aria-hidden="true" />, to: `/app/projects?p=${p.id}` })),
      ...state.tasks.map((t) => ({ id: `t-${t.id}`, group: 'Tasks', label: t.title, hint: projects.find((p) => p.id === t.projectId)?.name, icon: <ListChecks className="size-4" aria-hidden="true" />, to: `/app/tasks?q=${encodeURIComponent(t.title)}` })),
      ...state.automations.map((a) => ({ id: `a-${a.id}`, group: 'Automations', label: a.name, hint: a.enabled ? 'Active' : 'Paused', icon: <Workflow className="size-4" aria-hidden="true" />, to: `/app/automations?flow=${a.id}` })),
    ]
    const term = q.trim().toLowerCase()
    if (!term) return all.filter((i) => i.group === 'Go to' || i.group === 'Projects')
    return all.filter((i) => `${i.label} ${i.hint ?? ''}`.toLowerCase().includes(term)).slice(0, 12)
  }, [q, state.tasks, state.automations])

  const go = (i: Item | undefined) => {
    if (!i) return
    onClose()
    navigate(i.to)
  }

  let lastGroup = ''
  return (
    <dialog
      ref={ref}
      aria-label="Search and jump"
      onClose={onClose}
      className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface p-0 text-text shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85)] backdrop:bg-bg-deep/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search className="size-4.5 shrink-0 text-faint" aria-hidden="true" />
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={items[active] ? `${listId}-${items[active].id}` : undefined}
              aria-label="Search projects, tasks, automations and pages"
              placeholder="Search projects, tasks, automations…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setActive(0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActive((a) => Math.min(items.length - 1, a + 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActive((a) => Math.max(0, a - 1))
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                  go(items[active])
                }
              }}
              className="min-h-14 flex-1 bg-transparent text-[0.95rem] placeholder:text-faint focus:outline-none"
            />
            <kbd className="rounded border border-line-strong bg-surface-3 px-1.5 font-mono text-xs text-faint">esc</kbd>
          </div>
          <ul id={listId} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
            {items.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{q}”.</li>}
            {items.map((i, idx) => {
              const header = i.group !== lastGroup ? i.group : null
              lastGroup = i.group
              return (
                <li key={i.id} role="presentation">
                  {header && (
                    <div role="presentation" className="px-3 pb-1 pt-3 text-xs font-medium text-faint">
                      {header}
                    </div>
                  )}
                  <div
                    id={`${listId}-${i.id}`}
                    role="option"
                    aria-selected={idx === active}
                    tabIndex={-1}
                    onMouseMove={() => setActive(idx)}
                    onClick={() => go(i)}
                    onKeyDown={(e) => e.key === 'Enter' && go(i)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm ${idx === active ? 'bg-white/[0.07] text-text' : 'text-muted'}`}
                  >
                    <span className={idx === active ? 'text-brand-text' : 'text-faint'}>{i.icon}</span>
                    <span className="flex-1 truncate">{i.label}</span>
                    {i.hint && <span className="hidden truncate text-xs text-faint sm:inline">{i.hint}</span>}
                    {idx === active && <CornerDownLeft className="size-3.5 text-faint" aria-hidden="true" />}
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </dialog>
  )
}
