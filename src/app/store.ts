import { createContext, useContext, type Dispatch } from 'react'
import * as seed from './data.ts'
import type { Activity, Automation, Connector, Priority, Task, TaskStatus } from './data.ts'

/**
 * Demo-only state. Persisted to this browser's localStorage so interactions survive a reload.
 * There is no backend: nothing leaves the device.
 */
export type DemoState = {
  version: 1
  tasks: Task[]
  automations: Automation[]
  connectors: Connector[]
  activity: Activity[]
}

export type Action =
  | { type: 'task/status'; id: string; status: TaskStatus }
  | { type: 'task/add'; title: string; projectId: string; priority: Priority; assignee: string; dueInDays: number }
  | { type: 'automation/toggle'; id: string }
  | { type: 'automation/run'; id: string }
  | { type: 'connector/toggle'; id: string }
  | { type: 'reset' }

const KEY = 'nexa-demo-v2'
const STATUS_LABEL: Record<TaskStatus, string> = { todo: 'To do', 'in-progress': 'In progress', review: 'Review', done: 'Done' }

export function initialState(): DemoState {
  return { version: 1, tasks: seed.tasks, automations: seed.automations, connectors: seed.connectors, activity: seed.activity }
}

export function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (parsed.version === 1 && Array.isArray(parsed.tasks)) return parsed
    }
  } catch {
    /* storage blocked or corrupt — fall back to seed */
  }
  return initialState()
}

export function saveState(s: DemoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* storage unavailable (private mode) — demo still works in memory */
  }
}

let counter = 0
const uid = (p: string) => `${p}${Date.now().toString(36)}${(counter++).toString(36)}`
const log = (s: DemoState, a: Omit<Activity, 'id' | 'minutesAgo'>): Activity[] =>
  [{ ...a, id: uid('e'), minutesAgo: 0 }, ...s.activity].slice(0, 30)

export function reducer(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case 'task/status': {
      const task = s.tasks.find((t) => t.id === a.id)
      if (!task || task.status === a.status) return s
      const next = { ...s, tasks: s.tasks.map((t) => (t.id === a.id ? { ...t, status: a.status } : t)) }
      let activity = log(s, { who: 'you', text: `moved “${task.title}” to ${STATUS_LABEL[a.status]}`, kind: 'task' })
      // Simulated automation: moving to Review triggers the approver flow if it's enabled.
      const flow = s.automations.find((f) => f.id === 'a3')
      if (a.status === 'review' && flow?.enabled) {
        activity = [{ id: uid('e'), who: 'automation', text: `${flow.name} ran for “${task.title}” (simulated)`, minutesAgo: 0, kind: 'automation' as const }, ...activity]
        next.automations = s.automations.map((f) => (f.id === 'a3' ? { ...f, runs30d: f.runs30d + 1, lastRunMinutesAgo: 0 } : f))
      }
      return { ...next, activity }
    }
    case 'task/add': {
      const task: Task = { id: uid('t'), title: a.title, projectId: a.projectId, status: 'todo', priority: a.priority, assignee: a.assignee, dueInDays: a.dueInDays }
      return { ...s, tasks: [task, ...s.tasks], activity: log(s, { who: 'you', text: `created “${a.title}”`, kind: 'task' }) }
    }
    case 'automation/toggle': {
      const f = s.automations.find((x) => x.id === a.id)
      if (!f) return s
      return {
        ...s,
        automations: s.automations.map((x) => (x.id === a.id ? { ...x, enabled: !x.enabled } : x)),
        activity: log(s, { who: 'you', text: `${f.enabled ? 'paused' : 'enabled'} “${f.name}”`, kind: 'automation' }),
      }
    }
    case 'automation/run': {
      const f = s.automations.find((x) => x.id === a.id)
      if (!f) return s
      return {
        ...s,
        automations: s.automations.map((x) =>
          x.id === a.id ? { ...x, runs30d: x.runs30d + 1, lastRunMinutesAgo: 0, successRate: x.successRate || 100 } : x,
        ),
        activity: log(s, { who: 'automation', text: `${f.name} completed a test run (simulated)`, kind: 'automation' }),
      }
    }
    case 'connector/toggle': {
      const c = s.connectors.find((x) => x.id === a.id)
      if (!c) return s
      return {
        ...s,
        connectors: s.connectors.map((x) => (x.id === a.id ? { ...x, connected: !x.connected } : x)),
        activity: log(s, { who: 'you', text: `${c.connected ? 'disconnected' : 'connected'} the ${c.name} concept connector`, kind: 'project' }),
      }
    }
    case 'reset':
      return initialState()
  }
}

export const StoreContext = createContext<{ state: DemoState; dispatch: Dispatch<Action> } | null>(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
