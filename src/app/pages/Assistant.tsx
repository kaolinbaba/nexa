import { useReducedMotion } from 'motion/react'
import { ArrowUp, Bot, Check, Copy, Info, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from '../../components/Link.tsx'
import { Avatar } from '../../components/ui/index.ts'
import { useLocation } from '../../lib/router.ts'
import { people, projects } from '../data.ts'
import { dueLabel, person, PRIORITY, projectById } from '../labels.ts'
import { useStore, type DemoState } from '../store.ts'
import { useToast } from '../toast.ts'
import { PageHeader } from '../ui.tsx'

type Act = { label: string; kind: 'link'; to: string } | { label: string; kind: 'enable'; flow: string } | { label: string; kind: 'copy'; text: string }
type Msg = { id: number; role: 'user' | 'assistant'; text: string; bullets?: string[]; actions?: Act[] }

const SUGGESTIONS = [
  { id: 'risk', label: 'Which projects are at risk?' },
  { id: 'due', label: 'What’s due this week?' },
  { id: 'status', label: 'Draft a client update for Lumen' },
  { id: 'time', label: 'Where can automation save us time?' },
  { id: 'load', label: 'Who has the most on their plate?' },
]

/** Rule-based, data-aware responder. Clearly simulated: no model, no network. */
function respond(input: string, s: DemoState): Omit<Msg, 'id' | 'role'> {
  const t = input.toLowerCase()
  const open = s.tasks.filter((x) => x.status !== 'done')

  if (/risk|blocked|late|attention/.test(t)) {
    const risky = projects.filter((p) => p.status === 'at-risk' || p.status === 'blocked')
    return {
      text: `${risky.length} projects need attention right now:`,
      bullets: risky.map((p) => {
        const urgent = open.filter((x) => x.projectId === p.id && (x.priority === 'urgent' || x.priority === 'high'))
        return `${p.name} is ${p.status === 'blocked' ? 'blocked' : 'at risk'}. ${p.summary} ${urgent.length} high-priority task${urgent.length === 1 ? '' : 's'} open.`
      }),
      actions: risky.map((p) => ({ label: `Open ${p.name}`, kind: 'link' as const, to: `/app/projects?p=${p.id}` })),
    }
  }
  if (/due|week|deadline|today|tomorrow/.test(t)) {
    const due = open.filter((x) => x.dueInDays <= 7).sort((a, b) => a.dueInDays - b.dueInDays)
    return {
      text: due.length ? `${due.length} open tasks are due within 7 days, soonest first:` : 'Nothing is due in the next 7 days.',
      bullets: due.slice(0, 6).map((x) => `${dueLabel(x.dueInDays)}: ${x.title} (${projectById(x.projectId)?.name}, ${person(x.assignee).name.split(' ')[0]}, ${PRIORITY[x.priority].label.toLowerCase()})`),
      actions: [{ label: 'Open task board', kind: 'link', to: '/app/tasks' }],
    }
  }
  if (/status|update|client|draft|lumen/.test(t)) {
    const p = projects.find((x) => t.includes(x.name.split(' ')[0].toLowerCase())) ?? projects[0]
    const ts = s.tasks.filter((x) => x.projectId === p.id)
    const done = ts.filter((x) => x.status === 'done').map((x) => x.title)
    const doing = ts.filter((x) => x.status === 'in-progress' || x.status === 'review').map((x) => x.title)
    const next = ts.filter((x) => x.status === 'todo').map((x) => x.title)
    const draft = `Hi ${p.client} team,\n\nQuick update on ${p.name}. We're ${p.progress}% through and on course for ${dueLabel(p.dueInDays).toLowerCase()}.\n\nDone: ${done.join('; ') || 'kick-off tasks'}.\nIn progress: ${doing.join('; ') || 'nothing at the moment'}.\nNext up: ${next.join('; ') || 'final review'}.\n\nBest,\nMaya`
    return {
      text: `Here’s a draft for ${p.client}, built from the project’s current tasks:`,
      bullets: draft.split('\n').filter(Boolean),
      actions: [
        { label: 'Copy draft', kind: 'copy', text: draft },
        { label: `Open ${p.name}`, kind: 'link', to: `/app/projects?p=${p.id}` },
      ],
    }
  }
  if (/automat|save|time|flow/.test(t)) {
    const paused = s.automations.filter((a) => !a.enabled)
    const top = [...s.automations].sort((a, b) => b.runs30d * b.minutesSavedPerRun - a.runs30d * a.minutesSavedPerRun).slice(0, 3)
    const triage = s.automations.find((a) => a.id === 'a4')
    return {
      text: 'Your biggest time-savers over the last 30 days:',
      bullets: [
        ...top.map((a) => `${a.name}: about ${Math.round((a.runs30d * a.minutesSavedPerRun) / 60)}h saved across ${a.runs30d} runs`),
        paused.length ? `${paused.length} flows are paused. “Overdue task triage” would help most: there are ${open.filter((x) => x.dueInDays < 0).length} overdue tasks today.` : 'All flows are live.',
      ],
      actions: triage && !triage.enabled ? [{ label: 'Enable Overdue task triage', kind: 'enable', flow: 'a4' }, { label: 'View automations', kind: 'link', to: '/app/automations' }] : [{ label: 'View automations', kind: 'link', to: '/app/automations' }],
    }
  }
  if (/who|load|busy|plate|capacity|rebalance/.test(t)) {
    const load = people.map((pp) => ({ pp, n: open.filter((x) => x.assignee === pp.id).length })).sort((a, b) => b.n - a.n)
    return {
      text: `${load[0].pp.name} has the most open work (${load[0].n} tasks). Here’s everyone:`,
      bullets: load.map(({ pp, n }) => `${pp.name}, ${pp.role}: ${n} open`),
      actions: [{ label: `Filter tasks for ${load[0].pp.name.split(' ')[0]}`, kind: 'link', to: '/app/tasks' }, { label: 'See workload chart', kind: 'link', to: '/app/analytics' }],
    }
  }
  return {
    text: 'In this demo I can answer questions about the sample workspace. Try asking about:',
    bullets: ['Projects at risk', 'What’s due this week', 'Drafting a client status update', 'Where automation saves time', 'Who has the most work'],
  }
}

export function Assistant() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const reduce = useReducedMotion()
  const { search } = useLocation()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [copied, setCopied] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const asked = useRef(false)

  const send = (text: string) => {
    const q = text.trim()
    if (!q || typing) return
    setMsgs((m) => [...m, { id: nextId.current++, role: 'user', text: q }])
    setInput('')
    setTyping(true)
    window.setTimeout(
      () => {
        setMsgs((m) => [...m, { id: nextId.current++, role: 'assistant', ...respond(q, state) }])
        setTyping(false)
      },
      reduce ? 0 : 700,
    )
  }

  useEffect(() => {
    const ask = search.get('ask')
    if (ask && !asked.current) {
      asked.current = true
      const s = SUGGESTIONS.find((x) => x.id === ask)
      if (s) send(s.label)
    }
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [msgs, typing, reduce])

  const run = (a: Act) => {
    if (a.kind === 'enable') {
      dispatch({ type: 'automation/toggle', id: a.flow })
      toast('Overdue task triage enabled')
    }
    if (a.kind === 'copy') {
      navigator.clipboard?.writeText(a.text).then(
        () => {
          setCopied(true)
          toast('Draft copied to clipboard')
          window.setTimeout(() => setCopied(false), 2000)
        },
        () => toast('Copy is unavailable in this browser'),
      )
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="AI Assistant" description="Ask about the demo workspace. Answers are generated from the sample data by simple rules, not by an AI model." />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section aria-label="Conversation" className="panel flex min-h-[560px] flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" aria-live="polite" aria-busy={typing}>
            {msgs.length === 0 && (
              <div className="mx-auto max-w-md py-10 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet/35 bg-violet/10 text-violet-text">
                  <Sparkles className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">How can I help with Atlas &amp; Pine?</h2>
                <p className="mt-2 text-sm text-muted">I can see the projects, tasks and automations in this demo. Pick a suggestion or type a question.</p>
              </div>
            )}
            {msgs.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end gap-3">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-brand-strong px-4 py-2.5 text-sm text-white">{m.text}</p>
                  <Avatar name="Maya Chen" hue={220} size={30} />
                </div>
              ) : (
                <div key={m.id} className="fade-up flex gap-3">
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-violet/15 text-violet-text">
                    <Bot className="size-4" aria-hidden="true" />
                    <span className="sr-only">Nexa assistant</span>
                  </span>
                  <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border border-line bg-bg-deep/60 px-4 py-3 text-sm">
                    <p>{m.text}</p>
                    {m.bullets && (
                      <ul className="mt-2.5 space-y-1.5 text-muted">
                        {m.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-violet-text" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.actions && (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {m.actions.map((a) =>
                          a.kind === 'link' ? (
                            <Link key={a.label} to={a.to} className="inline-flex min-h-9 items-center rounded-lg border border-line-strong px-3 text-xs font-medium text-text hover:bg-white/5">
                              {a.label}
                            </Link>
                          ) : (
                            <button
                              key={a.label}
                              type="button"
                              onClick={() => run(a)}
                              disabled={a.kind === 'enable' && !!state.automations.find((f) => f.id === a.flow)?.enabled}
                              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-violet/40 bg-violet/10 px-3 text-xs font-medium text-violet-text hover:bg-violet/15 disabled:cursor-default disabled:opacity-60"
                            >
                              {a.kind === 'copy' && (copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />)}
                              {a.kind === 'enable' && state.automations.find((f) => f.id === a.flow)?.enabled ? 'Enabled' : a.label}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="grid size-[30px] place-items-center rounded-full bg-violet/15 text-violet-text">
                  <Bot className="size-4" aria-hidden="true" />
                </span>
                <span className="flex gap-1" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 animate-pulse-soft rounded-full bg-violet-text" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line p-4">
            <div className="scrollbar-none -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
              {SUGGESTIONS.map((s) => (
                <button key={s.id} type="button" onClick={() => send(s.label)} className="min-h-9 shrink-0 cursor-pointer rounded-full border border-line-strong px-3.5 text-xs text-muted transition-colors hover:border-violet/40 hover:text-text">
                  {s.label}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex items-center gap-2 rounded-xl border border-line-strong bg-bg-deep p-1.5 focus-within:border-brand">
              <label htmlFor="ask" className="sr-only">
                Ask the assistant
              </label>
              <input id="ask" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about projects, tasks or automations…" autoComplete="off" className="min-h-10 flex-1 rounded-md bg-transparent px-2.5 text-sm placeholder:text-faint focus-visible:outline-offset-1" />
              <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid size-10 cursor-pointer place-items-center rounded-lg bg-brand-strong text-white transition-opacity disabled:cursor-default disabled:opacity-40">
                <ArrowUp className="size-4.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-4" aria-label="About the assistant">
          <div className="panel p-5">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <Info className="size-4 text-cyan" aria-hidden="true" /> How this preview works
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              In the product concept, the assistant would use an LLM with access to your workspace. This demo reads the same sample data with simple rules, so answers update as you change tasks
              and flows, and nothing is sent anywhere.
            </p>
          </div>
          <div className="panel p-5">
            <h2 className="text-sm font-medium">It can take action</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Ask “Where can automation save us time?” and enable the suggested flow straight from the reply. Then check the Automations page.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
