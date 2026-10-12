import { Info, Search } from 'lucide-react'
import { useState } from 'react'
import { ConnectorGlyph } from '../../components/ConnectorGlyph.tsx'
import { Badge, Switch, Tabs } from '../../components/ui/index.ts'
import type { Connector } from '../data.ts'
import { useStore } from '../store.ts'
import { useToast } from '../toast.ts'
import { inputClass, PageHeader } from '../ui.tsx'

type Filter = 'all' | 'connected' | Connector['category']

export function Integrations() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const cats: Filter[] = ['all', 'connected', 'Communication', 'Engineering', 'Files', 'Sales', 'Finance', 'Developer']
  const count = (f: Filter) => state.connectors.filter((c) => (f === 'all' ? true : f === 'connected' ? c.connected : c.category === f)).length
  const list = state.connectors
    .filter((c) => (filter === 'all' ? true : filter === 'connected' ? c.connected : c.category === filter))
    .filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" description="Concept connectors that show how Nexa would link to the rest of your stack." />

      <p className="flex items-start gap-2.5 rounded-xl border border-cyan/25 bg-cyan/[0.06] px-4 py-3 text-sm text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
        <span>
          <span className="font-medium text-text">Simulated.</span> Toggling a connector only changes this demo. Nothing connects to a real service, and no credentials are requested.
        </span>
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs idBase="int-cat" label="Filter connectors" value={filter} onChange={setFilter} items={cats.map((c) => ({ id: c, label: c === 'all' ? 'All' : c === 'connected' ? 'Connected' : c, count: count(c) }))} />
        <label className="relative lg:w-64">
          <span className="sr-only">Search connectors</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search connectors" className={`${inputClass} min-h-10 pl-9 text-sm`} />
        </label>
      </div>

      <div id="int-cat-panel" role="tabpanel" aria-labelledby={`int-cat-tab-${filter}`} data-tour="integrations">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <li key={c.id} className="panel flex flex-col p-5">
              <div className="flex items-start gap-4">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl border ${c.connected ? 'border-brand/35 bg-brand/10 text-brand-text' : 'border-line-strong bg-surface-3 text-muted'}`}>
                  <ConnectorGlyph glyph={c.glyph} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium">{c.name}</h2>
                  <p id={`int-${c.id}`} className="mt-0.5 text-sm text-muted">
                    {c.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="flex items-center gap-2">
                  <Badge tone={c.connected ? 'success' : 'neutral'} dot>
                    {c.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                  <span className="text-xs text-faint">{c.category}</span>
                </span>
                <Switch
                  checked={c.connected}
                  label={`${c.name} connector`}
                  describedBy={`int-${c.id}`}
                  onChange={() => {
                    dispatch({ type: 'connector/toggle', id: c.id })
                    toast(`${c.name} ${c.connected ? 'disconnected' : 'connected'} (simulated)`)
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="panel p-10 text-center text-sm text-muted">No connectors match.</p>}
      </div>
    </div>
  )
}
