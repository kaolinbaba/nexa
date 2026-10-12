import { useReducedMotion } from 'motion/react'
import { Bell, Check, FileText, FolderPlus, Loader2, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../components/motion/Reveal.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Container, SectionHeader } from './Section.tsx'

const steps = [
  { icon: FileText, kind: 'Trigger', title: 'A new brief arrives', detail: 'Intake form submitted by Lumen Coffee Co.', log: 'trigger  intake.form.submitted  brief_id=LC-2041' },
  { icon: Sparkles, kind: 'Understand', title: 'AI reads and summarizes', detail: 'Scope, deliverables, risks and budget extracted', log: 'ai       summarized brief → 6 deliverables, 2 risks flagged' },
  { icon: FolderPlus, kind: 'Act', title: 'Project is set up', detail: '12 tasks created from the “Brand sprint” template', log: 'action   project.created  tasks=12  owner=sara' },
  { icon: Bell, kind: 'Report', title: 'The right people hear about it', detail: 'Kickoff posted to #studio, producer assigned', log: 'notify   #studio · @sara · @maya  (3 recipients)' },
]

type Phase = 'idle' | 'running' | 'done'

export function WorkflowSection() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [active, setActive] = useState(-1)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (reduce) {
      setActive(steps.length)
      setPhase('done')
      return
    }
    setPhase('running')
    setActive(0)
    steps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setActive(i + 1), 900 * (i + 1)))
    })
    timers.current.push(window.setTimeout(() => setPhase('done'), 900 * steps.length))
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    setPhase('idle')
    setActive(-1)
  }

  return (
    <section id="automation" aria-labelledby="automation-title" className="relative isolate scroll-mt-20 border-y border-line bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_55%,transparent),transparent_70%)] py-18 lg:py-22">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-violet/10 blur-[120px]" />
      <Container className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            id="automation-title"
            eyebrow="Workflow automation"
            accent="violet"
            title="Describe the busywork once. Nexa runs it from then on."
            lead="Every flow follows the same four steps: something happens, Nexa understands it, takes action and tells the right people. You can build flows visually or ask the assistant to draft one, then review it before it goes live."
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-3">
            {phase === 'idle' ? (
              <Button onClick={run}>
                <Play className="size-4" aria-hidden="true" /> Run sample flow
              </Button>
            ) : (
              <Button onClick={phase === 'done' ? run : reset} variant="secondary">
                {phase === 'done' ? <RotateCcw className="size-4" aria-hidden="true" /> : <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {phase === 'done' ? 'Run again' : 'Stop'}
              </Button>
            )}
            <span className="font-mono text-xs text-faint">Simulated run · no data leaves your browser</span>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-md bg-violet/15 text-violet-text">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium">New brief → project kickoff</span>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-xs ${
                  phase === 'done' ? 'border-success/30 bg-success/10 text-success' : phase === 'running' ? 'border-violet/35 bg-violet/10 text-violet-text' : 'border-line-strong text-faint'
                }`}
              >
                {phase === 'done' ? 'Completed' : phase === 'running' ? 'Running' : 'Ready'}
              </span>
            </div>

            <ol className="relative p-5 sm:p-6">
              {steps.map((s, i) => {
                const state = active > i ? 'done' : active === i ? 'running' : 'idle'
                const Icon = s.icon
                return (
                  <li key={s.kind} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < steps.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[19px] top-11 bottom-1 w-px overflow-hidden bg-line-strong">
                        <span
                          className="block h-full w-full origin-top bg-linear-to-b from-violet to-brand transition-transform duration-700 ease-[var(--ease-out-expo)]"
                          style={{ transform: `scaleY(${active > i ? 1 : 0})` }}
                        />
                      </span>
                    )}
                    <span
                      className={`relative grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                        state === 'done' ? 'border-success/40 bg-success/10 text-success' : state === 'running' ? 'border-violet/50 bg-violet/15 text-violet-text' : 'border-line-strong bg-surface-3 text-muted'
                      }`}
                    >
                      {state === 'done' ? <Check className="size-4.5" aria-hidden="true" /> : state === 'running' ? <Loader2 className="size-4.5 animate-spin" aria-hidden="true" /> : <Icon className="size-4.5" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
                        {String(i + 1).padStart(2, '0')} · {s.kind}
                      </p>
                      <h3 className="mt-1 font-medium text-text">{s.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{s.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="border-t border-line bg-bg-deep/80 px-5 py-4 font-mono text-xs leading-6 sm:px-6">
              <p className="mb-1 text-faint">run log</p>
              <div aria-live="polite" className="min-h-[6rem] overflow-x-auto">
                {active < 0 && <p className="text-faint">Press “Run sample flow” to watch Nexa work.</p>}
                {steps.slice(0, Math.max(0, active)).map((s, i) => (
                  <p key={s.kind} className="fade-up whitespace-pre text-muted">
                    <span className="text-faint">{`00:0${i}.${(i * 37 + 12) % 100}`.padEnd(9)}</span>
                    {s.log}
                  </p>
                ))}
                {phase === 'done' && <p className="fade-up text-success">✓ flow completed in 3.6s · saved about 45 min of setup</p>}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
