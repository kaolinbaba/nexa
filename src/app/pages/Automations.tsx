import { useReducedMotion } from 'motion/react'
import { Check, ChevronRight, Clock, Loader2, Play, Sparkles, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Dialog, Switch, Tabs } from '../../components/ui/index.ts'
import { fmt } from '../../lib/chart.ts'
import { setParam, useLocation } from '../../lib/router.ts'
import type { Automation } from '../data.ts'
import { agoLabel } from '../labels.ts'
import { useStore } from '../store.ts'
import { useToast } from '../toast.ts'
import { PageHeader, Stat } from '../ui.tsx'

type Cat = 'all' | Automation['category']

function FlowDialog({ flow, onClose }: { flow: Automation | undefined; onClose: () => void }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(-1)
  const timers = useRef<number[]>([])
  const running = step >= 0 && flow && step < flow.steps.length

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const close = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
    onClose()
  }

  const test = () => {
    if (!flow) return
    timers.current.forEach(clearTimeout)
    const total = flow.steps.length + 1
    if (reduce) {
      setStep(total)
    } else {
      setStep(0)
      for (let i = 1; i <= total; i++) timers.current.push(window.setTimeout(() => setStep(i), 650 * i))
    }
    timers.current.push(
      window.setTimeout(
        () => {
          dispatch({ type: 'automation/run', id: flow.id })
          toast('Test run completed (simulated)')
        },
        reduce ? 0 : 650 * total,
      ),
    )
  }

  return (
    <Dialog
      open={!!flow}
      onClose={close}
      wide
      title={flow?.name ?? ''}
      description={flow ? `Trigger: ${flow.trigger}` : undefined}
      footer={
        flow && (
          <>
            <span className="mr-auto flex items-center gap-3 text-sm text-muted">
              <Switch
                checked={flow.enabled}
                label={`${flow.name} enabled`}
                onChange={() => {
                  dispatch({ type: 'automation/toggle', id: flow.id })
                  toast(flow.enabled ? 'Automation paused' : 'Automation enabled')
                }}
              />
              {flow.enabled ? 'Live' : 'Paused'}
            </span>
            <Button onClick={test} disabled={!!running}>
              {running ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
              {running ? 'Running…' : 'Run test'}
            </Button>
          </>
        )
      }
    >
      {flow && (
        <>
          <ol className="relative space-y-3" aria-live="polite">
            {['Trigger: ' + flow.trigger, ...flow.steps].map((s, i) => {
              const state = step > i ? 'done' : step === i ? 'running' : 'idle'
              const ai = /AI/.test(s)
              return (
                <li key={s} className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors duration-300 ${state === 'done' ? 'border-success/30 bg-success/[0.05]' : state === 'running' ? 'border-violet/40 bg-violet/[0.07]' : 'border-line bg-bg-deep/50'}`}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-xs ${state === 'done' ? 'bg-success/15 text-success' : state === 'running' ? 'bg-violet/20 text-violet-text' : 'bg-surface-3 text-muted'}`}>
                    {state === 'done' ? <Check className="size-4" aria-hidden="true" /> : state === 'running' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : i === 0 ? <Zap className="size-4" aria-hidden="true" /> : i}
                  </span>
                  <span className="flex-1 text-sm">{s}</span>
                  {ai && <Badge tone="violet">AI</Badge>}
                  <span className="sr-only">{state === 'done' ? 'completed' : state === 'running' ? 'running' : ''}</span>
                </li>
              )
            })}
          </ol>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-line p-3">
              <dt className="text-xs text-faint">Runs (30d)</dt>
              <dd className="mt-1 font-mono">{flow.runs30d}</dd>
            </div>
            <div className="rounded-lg border border-line p-3">
              <dt className="text-xs text-faint">Success</dt>
              <dd className="mt-1 font-mono">{flow.successRate ? `${flow.successRate}%` : '—'}</dd>
            </div>
            <div className="rounded-lg border border-line p-3">
              <dt className="text-xs text-faint">Saves / run</dt>
              <dd className="mt-1 font-mono">{flow.minutesSavedPerRun} min</dd>
            </div>
          </dl>
          <p className="mt-4 font-mono text-xs text-faint">Test runs are simulated in your browser. No messages are sent.</p>
        </>
      )}
    </Dialog>
  )
}

export function Automations() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const { search } = useLocation()
  const [cat, setCat] = useState<Cat>('all')
  const openId = search.get('flow')
  const open = state.automations.find((a) => a.id === openId)

  const list = cat === 'all' ? state.automations : state.automations.filter((a) => a.category === cat)
  const live = state.automations.filter((a) => a.enabled)
  const runs = state.automations.reduce((s, a) => s + a.runs30d, 0)
  const hours = Math.round(state.automations.reduce((s, a) => s + a.runs30d * a.minutesSavedPerRun, 0) / 60)
  const cats: Cat[] = ['all', 'Intake', 'Delivery', 'Reporting', 'Ops']

  return (
    <div className="space-y-6">
      <PageHeader title="Automations" description="Flows run on triggers you define. Toggle them on or off, or open one to run a simulated test." />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Live flows" value={`${live.length} of ${state.automations.length}`} icon={<Zap className="size-4" />} accent="text-violet-text" note="Paused flows keep their history" />
        <Stat label="Runs · 30 days" value={fmt.format(runs)} icon={<Play className="size-4" />} note="Across all flows" />
        <Stat label="Time saved · 30 days" value={`${hours}h`} icon={<Clock className="size-4" />} accent="text-cyan" note="Estimated from minutes saved per run" />
      </div>

      <Tabs idBase="flow-cat" label="Filter automations by category" value={cat} onChange={setCat} items={cats.map((c) => ({ id: c, label: c === 'all' ? 'All flows' : c, count: c === 'all' ? state.automations.length : state.automations.filter((a) => a.category === c).length }))} />

      <div id="flow-cat-panel" role="tabpanel" aria-labelledby={`flow-cat-tab-${cat}`} data-tour="automations">
        <ul className="grid gap-3 lg:grid-cols-2">
          {list.map((a) => {
            const descId = `flow-${a.id}-desc`
            return (
              <li key={a.id} className={`panel flex flex-col p-5 transition-colors ${a.enabled ? '' : 'opacity-[0.88]'}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl border ${a.enabled ? 'border-violet/35 bg-violet/10 text-violet-text' : 'border-line-strong bg-surface-3 text-faint'}`}>
                    <Sparkles className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium">{a.name}</h2>
                    <p id={descId} className="mt-0.5 text-sm text-muted">
                      When: {a.trigger}
                    </p>
                  </div>
                  <Switch
                    checked={a.enabled}
                    label={`${a.name}: ${a.enabled ? 'on' : 'off'}`}
                    describedBy={descId}
                    onChange={() => {
                      dispatch({ type: 'automation/toggle', id: a.id })
                      toast(`${a.name} ${a.enabled ? 'paused' : 'enabled'}`)
                    }}
                  />
                </div>
                <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-xs" aria-label="Steps">
                  {a.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className="rounded-md border border-line bg-bg-deep/60 px-2 py-1 text-muted">{s}</span>
                      {i < a.steps.length - 1 && <ChevronRight className="size-3 text-faint" aria-hidden="true" />}
                    </li>
                  ))}
                </ol>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 text-xs text-faint">
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <Badge tone={a.enabled ? 'success' : 'neutral'} dot>
                      {a.enabled ? 'Live' : 'Paused'}
                    </Badge>
                    <span>{a.runs30d} runs</span>
                    <span>{a.runs30d ? `last ${agoLabel(a.lastRunMinutesAgo)}` : 'never run'}</span>
                  </span>
                  <Button size="sm" variant="secondary" aria-label={`Open flow: ${a.name}`} onClick={() => setParam('flow', a.id)}>
                    Open flow
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <FlowDialog flow={open} onClose={() => setParam('flow', null)} />
    </div>
  )
}
