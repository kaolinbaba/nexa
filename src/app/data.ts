/**
 * DEMO DATA — entirely fictional. "Atlas & Pine" is an invented agency workspace; people,
 * projects, numbers and connectors do not represent real organisations or integrations.
 */

export type Person = { id: string; name: string; role: string; hue: number }
export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'done'
export type Project = {
  id: string
  name: string
  client: string
  status: ProjectStatus
  progress: number
  dueInDays: number
  lead: string
  members: string[]
  accent: 'brand' | 'violet' | 'cyan'
  summary: string
}
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type Task = {
  id: string
  title: string
  projectId: string
  status: TaskStatus
  priority: Priority
  assignee: string
  dueInDays: number
  automated?: boolean
}
export type Automation = {
  id: string
  name: string
  trigger: string
  steps: string[]
  enabled: boolean
  runs30d: number
  minutesSavedPerRun: number
  successRate: number
  lastRunMinutesAgo: number
  category: 'Intake' | 'Delivery' | 'Reporting' | 'Ops'
}
export type Connector = {
  id: string
  name: string
  category: 'Communication' | 'Engineering' | 'Files' | 'Sales' | 'Finance' | 'Developer'
  description: string
  connected: boolean
  glyph: 'chat' | 'code' | 'folder' | 'pen' | 'users' | 'book' | 'card' | 'mail' | 'calendar' | 'webhook' | 'table' | 'braces'
}
export type Activity = { id: string; who: string; text: string; minutesAgo: number; kind: 'task' | 'automation' | 'project' | 'ai' }

export const WORKSPACE = 'Atlas & Pine'

export const people: Person[] = [
  { id: 'maya', name: 'Maya Chen', role: 'Design Director', hue: 220 },
  { id: 'leo', name: 'Leo Okafor', role: 'Engineering Lead', hue: 262 },
  { id: 'sara', name: 'Sara Lindqvist', role: 'Producer', hue: 188 },
  { id: 'tomas', name: 'Tomás Rivera', role: 'Brand Designer', hue: 300 },
  { id: 'priya', name: 'Priya Nair', role: 'Growth Strategist', hue: 160 },
  { id: 'jonah', name: 'Jonah Weiss', role: 'Frontend Engineer', hue: 30 },
]

export const projects: Project[] = [
  { id: 'lumen', name: 'Lumen Coffee rebrand', client: 'Lumen Coffee Co.', status: 'on-track', progress: 72, dueInDays: 12, lead: 'maya', members: ['maya', 'tomas', 'sara'], accent: 'violet', summary: 'Identity system, packaging and a new storefront for a specialty roaster.' },
  { id: 'orbit', name: 'Orbit mobile app', client: 'Orbit Fitness', status: 'at-risk', progress: 48, dueInDays: 6, lead: 'leo', members: ['leo', 'jonah', 'maya'], accent: 'brand', summary: 'React Native app for class booking. Payments flow is behind schedule.' },
  { id: 'q4', name: 'Q4 growth campaign', client: 'Internal', status: 'on-track', progress: 35, dueInDays: 28, lead: 'priya', members: ['priya', 'tomas'], accent: 'cyan', summary: 'Paid social + lifecycle emails for the agency’s own pipeline.' },
  { id: 'portal', name: 'Client portal v2', client: 'Internal', status: 'blocked', progress: 61, dueInDays: 3, lead: 'jonah', members: ['jonah', 'leo', 'sara'], accent: 'brand', summary: 'Self-serve approvals and invoices. Waiting on legal review of the new terms.' },
  { id: 'fieldnote', name: 'Fieldnote guidelines', client: 'Fieldnote Press', status: 'on-track', progress: 88, dueInDays: 9, lead: 'tomas', members: ['tomas', 'maya'], accent: 'violet', summary: 'Editorial brand guidelines and a component library for a publisher.' },
  { id: 'onboard', name: 'Onboarding automation', client: 'Internal', status: 'done', progress: 100, dueInDays: -4, lead: 'sara', members: ['sara', 'priya'], accent: 'cyan', summary: 'Kickoff checklist, contracts and workspace setup now run on their own.' },
]

export const tasks: Task[] = [
  { id: 't1', title: 'Finalize primary logo lockups', projectId: 'lumen', status: 'review', priority: 'high', assignee: 'tomas', dueInDays: 2 },
  { id: 't2', title: 'Packaging dieline for 250g bag', projectId: 'lumen', status: 'in-progress', priority: 'medium', assignee: 'maya', dueInDays: 5 },
  { id: 't3', title: 'Storefront product page wireframes', projectId: 'lumen', status: 'todo', priority: 'medium', assignee: 'maya', dueInDays: 10 },
  { id: 't4', title: 'Send weekly status to client', projectId: 'lumen', status: 'done', priority: 'low', assignee: 'sara', dueInDays: -1, automated: true },
  { id: 't5', title: 'Payments: handle declined cards', projectId: 'orbit', status: 'in-progress', priority: 'urgent', assignee: 'leo', dueInDays: 1 },
  { id: 't6', title: 'Class booking empty states', projectId: 'orbit', status: 'todo', priority: 'medium', assignee: 'jonah', dueInDays: 4 },
  { id: 't7', title: 'Push notification permissions copy', projectId: 'orbit', status: 'review', priority: 'low', assignee: 'maya', dueInDays: -2 },
  { id: 't8', title: 'Fix calendar sync timezone bug', projectId: 'orbit', status: 'todo', priority: 'high', assignee: 'jonah', dueInDays: -1 },
  { id: 't9', title: 'Audience segments for lifecycle', projectId: 'q4', status: 'in-progress', priority: 'medium', assignee: 'priya', dueInDays: 13 },
  { id: 't10', title: 'Ad creative: 3 concepts', projectId: 'q4', status: 'todo', priority: 'high', assignee: 'tomas', dueInDays: 11 },
  { id: 't11', title: 'UTM naming convention', projectId: 'q4', status: 'done', priority: 'low', assignee: 'priya', dueInDays: -3 },
  { id: 't12', title: 'Legal review of new terms', projectId: 'portal', status: 'in-progress', priority: 'urgent', assignee: 'sara', dueInDays: 1 },
  { id: 't13', title: 'Invoice PDF export', projectId: 'portal', status: 'review', priority: 'medium', assignee: 'jonah', dueInDays: 2 },
  { id: 't14', title: 'Approval request notifications', projectId: 'portal', status: 'todo', priority: 'high', assignee: 'leo', dueInDays: 3, automated: true },
  { id: 't15', title: 'Typography scale for print', projectId: 'fieldnote', status: 'done', priority: 'medium', assignee: 'tomas', dueInDays: -2 },
  { id: 't16', title: 'Component library handoff', projectId: 'fieldnote', status: 'in-progress', priority: 'medium', assignee: 'maya', dueInDays: 4 },
  { id: 't17', title: 'Archive kickoff templates', projectId: 'onboard', status: 'done', priority: 'low', assignee: 'sara', dueInDays: -6, automated: true },
  { id: 't18', title: 'Retro notes and learnings', projectId: 'onboard', status: 'done', priority: 'low', assignee: 'priya', dueInDays: -4 },
]

export const automations: Automation[] = [
  { id: 'a1', name: 'New brief → project kickoff', trigger: 'Intake form submitted', steps: ['Summarize brief with AI', 'Create project from template', 'Assign producer', 'Post kickoff in #studio'], enabled: true, runs30d: 14, minutesSavedPerRun: 45, successRate: 100, lastRunMinutesAgo: 95, category: 'Intake' },
  { id: 'a2', name: 'Weekly client status digest', trigger: 'Every Friday 16:00', steps: ['Collect completed tasks', 'Draft summary with AI', 'Queue email for review'], enabled: true, runs30d: 20, minutesSavedPerRun: 30, successRate: 97, lastRunMinutesAgo: 1460, category: 'Reporting' },
  { id: 'a3', name: 'Review ready → notify approver', trigger: 'Task moved to Review', steps: ['Find project approver', 'Send approval request', 'Set reminder after 24h'], enabled: true, runs30d: 61, minutesSavedPerRun: 6, successRate: 99, lastRunMinutesAgo: 12, category: 'Delivery' },
  { id: 'a4', name: 'Overdue task triage', trigger: 'Daily 09:00', steps: ['Find overdue tasks', 'Suggest new owners with AI', 'Notify project leads'], enabled: false, runs30d: 0, minutesSavedPerRun: 20, successRate: 0, lastRunMinutesAgo: 0, category: 'Ops' },
  { id: 'a5', name: 'Invoice on milestone done', trigger: 'Milestone completed', steps: ['Generate invoice draft', 'Attach deliverables list', 'Send to finance for approval'], enabled: true, runs30d: 5, minutesSavedPerRun: 35, successRate: 100, lastRunMinutesAgo: 4320, category: 'Ops' },
  { id: 'a6', name: 'Design file → handoff checklist', trigger: 'File marked “Ready for dev”', steps: ['Extract tokens & assets', 'Create dev tasks', 'Link file in task'], enabled: false, runs30d: 0, minutesSavedPerRun: 25, successRate: 0, lastRunMinutesAgo: 0, category: 'Delivery' },
]

export const connectors: Connector[] = [
  { id: 'c1', name: 'Team chat', category: 'Communication', description: 'Post updates and approvals to channels.', connected: true, glyph: 'chat' },
  { id: 'c2', name: 'Email', category: 'Communication', description: 'Send digests and client updates.', connected: true, glyph: 'mail' },
  { id: 'c3', name: 'Calendar', category: 'Communication', description: 'Sync milestones and review sessions.', connected: false, glyph: 'calendar' },
  { id: 'c4', name: 'Code repository', category: 'Engineering', description: 'Link pull requests to tasks.', connected: true, glyph: 'code' },
  { id: 'c5', name: 'Design files', category: 'Files', description: 'Attach frames and track handoff.', connected: true, glyph: 'pen' },
  { id: 'c6', name: 'Cloud storage', category: 'Files', description: 'Store deliverables per project.', connected: false, glyph: 'folder' },
  { id: 'c7', name: 'Docs & wiki', category: 'Files', description: 'Turn briefs and notes into tasks.', connected: false, glyph: 'book' },
  { id: 'c8', name: 'CRM', category: 'Sales', description: 'Start projects from won deals.', connected: false, glyph: 'users' },
  { id: 'c9', name: 'Payments', category: 'Finance', description: 'Create invoices from milestones.', connected: true, glyph: 'card' },
  { id: 'c10', name: 'Spreadsheets', category: 'Finance', description: 'Export time and budget reports.', connected: false, glyph: 'table' },
  { id: 'c11', name: 'Webhooks', category: 'Developer', description: 'Trigger flows from any service.', connected: true, glyph: 'webhook' },
  { id: 'c12', name: 'REST API', category: 'Developer', description: 'Read and write workspace data.', connected: false, glyph: 'braces' },
]

export const activity: Activity[] = [
  { id: 'e1', who: 'automation', text: 'Review ready → notify approver ran for “Invoice PDF export”', minutesAgo: 12, kind: 'automation' },
  { id: 'e2', who: 'leo', text: 'moved “Payments: handle declined cards” to In progress', minutesAgo: 38, kind: 'task' },
  { id: 'e3', who: 'ai', text: 'flagged Orbit mobile app as at risk: 2 high-priority tasks due within 48h', minutesAgo: 64, kind: 'ai' },
  { id: 'e4', who: 'automation', text: 'New brief → project kickoff created “Q4 growth campaign” tasks', minutesAgo: 95, kind: 'automation' },
  { id: 'e5', who: 'tomas', text: 'submitted “Finalize primary logo lockups” for review', minutesAgo: 180, kind: 'task' },
  { id: 'e6', who: 'sara', text: 'marked Onboarding automation as done', minutesAgo: 2880, kind: 'project' },
]

/* ---------- Analytics (deterministic pseudo-random series) ---------- */

export type Period = '7d' | '30d' | '90d' | '12m'
export const PERIODS: { id: Period; label: string; points: number; unit: 'day' | 'week' | 'month' }[] = [
  { id: '7d', label: '7 days', points: 7, unit: 'day' },
  { id: '30d', label: '30 days', points: 30, unit: 'day' },
  { id: '90d', label: '90 days', points: 13, unit: 'week' },
  { id: '12m', label: '12 months', points: 12, unit: 'month' },
]

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export type SeriesPoint = { label: string; completed: number; automated: number }

export function seriesFor(period: Period): SeriesPoint[] {
  const cfg = PERIODS.find((p) => p.id === period)!
  const r = rng(period.length * 97 + cfg.points * 13)
  const scale = cfg.unit === 'day' ? 1 : cfg.unit === 'week' ? 6 : 24
  const now = new Date()
  return Array.from({ length: cfg.points }, (_, i) => {
    const t = i / Math.max(1, cfg.points - 1)
    const base = (6 + t * 5 + Math.sin(i * 0.9) * 1.6) * scale
    const completed = Math.round(base + r() * 2.5 * scale)
    const automated = Math.round(completed * (0.32 + t * 0.18 + r() * 0.06))
    const d = new Date(now)
    const back = cfg.points - 1 - i
    if (cfg.unit === 'day') d.setDate(d.getDate() - back)
    if (cfg.unit === 'week') d.setDate(d.getDate() - back * 7)
    if (cfg.unit === 'month') d.setMonth(d.getMonth() - back)
    const label =
      cfg.unit === 'month'
        ? d.toLocaleDateString('en', { month: 'short' })
        : d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
    return { label, completed, automated }
  })
}

export function summaryFor(period: Period) {
  const s = seriesFor(period)
  const completed = s.reduce((a, p) => a + p.completed, 0)
  const automated = s.reduce((a, p) => a + p.automated, 0)
  const half = Math.floor(s.length / 2)
  const first = s.slice(0, half).reduce((a, p) => a + p.completed, 0) || 1
  const second = s.slice(half).reduce((a, p) => a + p.completed, 0)
  return {
    completed,
    automated,
    hoursSaved: Math.round((automated * 14) / 60),
    cycleDays: Number((3.9 - s.length / 60).toFixed(1)),
    trend: Math.round(((second - first) / first) * 100),
  }
}
