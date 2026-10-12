import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../components/ui/index.ts'
import { navigate } from '../lib/router.ts'
import type { SectionId } from './labels.ts'

const STEPS: { section: SectionId; target?: string; title: string; body: string }[] = [
  { section: 'overview', target: 'kpis', title: 'Welcome to the Nexa demo', body: 'This is a fictional agency workspace with sample data. These numbers update as you work. Everything you change is saved only in your browser.' },
  { section: 'projects', target: 'projects', title: 'Pick a project', body: 'Select any project to see its progress, team and tasks. Change a task’s status right from the detail panel.' },
  { section: 'tasks', target: 'tasks', title: 'Move work forward', body: 'Filter the board, then set a task to Review. The “notify approver” automation runs for it (simulated) and shows up in Activity.' },
  { section: 'automations', target: 'automations', title: 'Automations you control', body: 'Switch flows on or off, or open one and run a step-by-step test.' },
  { section: 'analytics', target: 'analytics', title: 'Measure the impact', body: 'Switch the period to explore throughput, cycle time and hours saved. You can also open the data table for every chart.' },
  { section: 'assistant', title: 'Ask the assistant', body: 'It answers from the same live data and can take actions, like enabling a suggested automation. Press ⌘K anytime to jump anywhere.' },
]

export function Tour({ step }: { step: number }) {
  const s = STEPS[step - 1]
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!s?.target) return
    let el: Element | null = null
    const id = requestAnimationFrame(() => {
      el = document.querySelector(`[data-tour="${s.target}"]`)
      el?.classList.add('tour-target')
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
    return () => {
      cancelAnimationFrame(id)
      el?.classList.remove('tour-target')
    }
  }, [s])

  useEffect(() => {
    if (step > 1) headingRef.current?.focus()
  }, [step])

  if (!s) return null
  const go = (n: number) => {
    const t = STEPS[n - 1]
    navigate(t ? `/app/${t.section}?tour=${n}` : '/app/overview')
  }

  return (
    <section
      aria-labelledby="tour-title"
      className="fade-up fixed inset-x-3 border border-line-strong bg-surface-2/95 backdrop-blur-xl bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] z-40 rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-xs text-violet-text">
          <Sparkles className="size-3.5" aria-hidden="true" /> GUIDED TOUR · {step}/{STEPS.length}
        </p>
        <button type="button" onClick={() => navigate(`/app/${s.section}`)} aria-label="End tour" className="-mr-2 -mt-2 grid size-10 cursor-pointer place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-text">
          <X className="size-4.5" aria-hidden="true" />
        </button>
      </div>
      <h2 id="tour-title" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-lg font-semibold tracking-tight focus:outline-none">
        {s.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="mr-auto flex gap-1" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1 rounded-full transition-all ${i + 1 === step ? 'w-5 bg-violet-text' : 'w-1.5 bg-line-strong'}`} />
          ))}
        </span>
        {step > 1 && (
          <Button size="sm" variant="ghost" onClick={() => go(step - 1)}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Button>
        )}
        <Button size="sm" onClick={() => go(step + 1)}>
          {step === STEPS.length ? 'Finish' : 'Next'} {step < STEPS.length && <ArrowRight className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </section>
  )
}
