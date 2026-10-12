import { BarChart3, Bot, FolderKanban, LayoutDashboard, ListChecks, Plug, Workflow } from 'lucide-react'
import type { Tone } from '../components/ui/primitives.tsx'
import { people, projects, type Priority, type ProjectStatus, type TaskStatus } from './data.ts'

export const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
] as const
export type SectionId = (typeof SECTIONS)[number]['id']
export const isSection = (s: string): s is SectionId => SECTIONS.some((x) => x.id === s)

export const TASK_STATUS: { id: TaskStatus; label: string; tone: Tone }[] = [
  { id: 'todo', label: 'To do', tone: 'neutral' },
  { id: 'in-progress', label: 'In progress', tone: 'brand' },
  { id: 'review', label: 'Review', tone: 'violet' },
  { id: 'done', label: 'Done', tone: 'success' },
]
export const taskStatus = (s: TaskStatus) => TASK_STATUS.find((x) => x.id === s)!

export const PRIORITY: Record<Priority, { label: string; tone: Tone; rank: number }> = {
  urgent: { label: 'Urgent', tone: 'danger', rank: 0 },
  high: { label: 'High', tone: 'warning', rank: 1 },
  medium: { label: 'Medium', tone: 'neutral', rank: 2 },
  low: { label: 'Low', tone: 'neutral', rank: 3 },
}

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; tone: Tone }> = {
  'on-track': { label: 'On track', tone: 'success' },
  'at-risk': { label: 'At risk', tone: 'warning' },
  blocked: { label: 'Blocked', tone: 'danger' },
  done: { label: 'Done', tone: 'cyan' },
}

export const person = (id: string) => people.find((p) => p.id === id) ?? { id, name: 'You', role: 'Demo user', hue: 215 }
export const projectById = (id: string) => projects.find((p) => p.id === id)

export function dueLabel(days: number) {
  if (days < -1) return `${-days} days ago`
  if (days === -1) return 'Yesterday'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `In ${days} days`
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function agoLabel(min: number) {
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  if (min < 60 * 24) return `${Math.round(min / 60)}h ago`
  return `${Math.round(min / 1440)}d ago`
}
