import { Bot, Command, FolderKanban, History, KanbanSquare, Search, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal } from '../components/motion/Reveal.tsx'
import { Container, SectionHeader } from './Section.tsx'

function Card({ icon, title, body, children, className = '', delay = 0 }: { icon: ReactNode; title: string; body: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`panel group relative flex flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-line-strong sm:p-7 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg border border-line-strong bg-surface-3 text-brand-text">{icon}</span>
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{body}</p>
      <div aria-hidden="true" className="mt-6 flex-1">
        {children}
      </div>
    </Reveal>
  )
}

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 pb-18 pt-10 lg:pb-22 lg:pt-12">
      <Container>
        <SectionHeader
          id="features-title"
          eyebrow="Product"
          title={
            <>
              Everything your team runs on, <span className="text-muted">in one place.</span>
            </>
          }
          lead="Most teams juggle a project tool, a task board, a reporting spreadsheet and a pile of scripts. Nexa puts them in one workspace that shares the same data, so updates flow through on their own."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Card
            className="lg:col-span-4"
            icon={<Bot className="size-4.5" />}
            title="An AI operator for the busywork"
            body="Ask in plain language. Nexa reads your projects and tasks, then drafts the status update, reassigns overdue work or builds the automation for you. You approve every change."
          >
            <div className="grid gap-3 rounded-xl border border-line bg-bg-deep/70 p-4 text-sm">
              <div className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-brand-strong/90 px-3.5 py-2 text-white">Which projects are at risk this week?</div>
              <div className="flex max-w-[92%] gap-2.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-violet/20 text-violet-text">
                  <Sparkles className="size-3.5" />
                </span>
                <div className="rounded-xl rounded-tl-sm border border-line bg-surface-2 px-3.5 py-2.5 text-muted">
                  <span className="text-text">Two need attention.</span> Orbit mobile app has 2 high-priority tasks due within 48h, and Client portal v2 is blocked
                  on legal review.
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <span className="rounded-md border border-line-strong px-2 py-1 text-xs text-text">Draft client update</span>
                    <span className="rounded-md border border-line-strong px-2 py-1 text-xs text-text">Rebalance workload</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2" delay={0.05} icon={<FolderKanban className="size-4.5" />} title="Projects that report on themselves" body="Progress, risk and next steps update as work moves, so you never chase a status again.">
            <div className="space-y-2.5">
              {[
                { n: 'Lumen Coffee rebrand', p: 72, c: 'bg-violet', s: 'On track', t: 'text-success' },
                { n: 'Orbit mobile app', p: 48, c: 'bg-brand', s: 'At risk', t: 'text-warning' },
                { n: 'Fieldnote guidelines', p: 88, c: 'bg-cyan', s: 'On track', t: 'text-success' },
              ].map((r) => (
                <div key={r.n} className="rounded-lg border border-line bg-bg-deep/60 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate text-text">{r.n}</span>
                    <span className={`text-xs ${r.t}`}>{r.s}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2" delay={0.05} icon={<KanbanSquare className="size-4.5" />} title="Boards that keep pace" body="Board or list, filtered by person, project or priority. Moving a card can set off the next step automatically.">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                ['To do', ['Wireframes', 'Empty states']],
                ['Doing', ['Declined cards', 'Dieline']],
                ['Review', ['Logo lockups']],
              ].map(([col, items]) => (
                <div key={col as string} className="rounded-lg border border-line bg-bg-deep/60 p-2">
                  <div className="mb-2 text-faint">{col}</div>
                  <div className="space-y-1.5">
                    {(items as string[]).map((t) => (
                      <div key={t} className="rounded-md border border-line bg-surface-2 px-2 py-1.5 text-text">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2" delay={0.1} icon={<Command className="size-4.5" />} title="Keyboard-first, everywhere" body="Press ⌘K to jump to any project, task or automation. Most actions are a keystroke away.">
            <div className="overflow-hidden rounded-xl border border-line bg-bg-deep/70">
              <div className="flex items-center gap-2 border-b border-line px-3 py-2.5 text-sm text-muted">
                <Search className="size-3.5" /> orbit pay
                <kbd className="ml-auto rounded border border-line-strong bg-surface-3 px-1.5 font-mono text-xs text-faint">esc</kbd>
              </div>
              {['Payments: handle declined cards', 'Orbit mobile app', 'Invoice on milestone done'].map((t, i) => (
                <div key={t} className={`flex items-center justify-between px-3 py-2 text-sm ${i === 0 ? 'bg-white/[0.05] text-text' : 'text-muted'}`}>
                  <span className="truncate">{t}</span>
                  {i === 0 && <kbd className="font-mono text-xs text-faint">↵</kbd>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2" delay={0.15} icon={<History className="size-4.5" />} title="Every change, on the record" body="A clear activity trail shows who did what, including every step your automations and the assistant took.">
            <ul className="space-y-2.5 text-sm">
              {[
                ['automation', 'notified approver for “Invoice PDF export”', 'text-violet-text'],
                ['Leo', 'moved “Declined cards” to In progress', 'text-brand-text'],
                ['assistant', 'flagged Orbit as at risk', 'text-cyan'],
              ].map(([who, what, c]) => (
                <li key={what} className="flex gap-2.5 rounded-lg border border-line bg-bg-deep/60 px-3 py-2">
                  <span className={`font-mono text-xs leading-5 ${c}`}>{who}</span>
                  <span className="text-muted">{what}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  )
}
