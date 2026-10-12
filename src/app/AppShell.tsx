import { ArrowLeft, Info, Menu, Plus, RotateCcw, Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Logo } from '../components/brand/Logo.tsx'
import { Link } from '../components/Link.tsx'
import { Avatar, Button, Dialog } from '../components/ui/index.ts'
import { WORKSPACE } from './data.ts'
import { SECTIONS, type SectionId } from './labels.ts'
import { useStore } from './store.ts'
import { useToast } from './toast.ts'

const MOBILE_TABS: SectionId[] = ['overview', 'projects', 'tasks', 'automations', 'assistant']

function NavList({ current, onNavigate }: { current: SectionId; onNavigate?: () => void }) {
  return (
    <ul className="grid gap-0.5">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = id === current
        return (
          <li key={id}>
            <Link
              to={`/app/${id}`}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                active ? 'bg-white/[0.07] text-text shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]' : 'text-muted hover:bg-white/[0.04] hover:text-text'
              }`}
            >
              <Icon className={`size-4 ${active ? 'text-brand-text' : 'text-faint group-hover:text-muted'}`} aria-hidden="true" />
              {label}
              {id === 'assistant' && <span className="ml-auto rounded-md bg-violet/15 px-1.5 py-0.5 font-mono text-xs text-violet-text">AI</span>}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function SidebarBody({ current, onNavigate, onReset }: { current: SectionId; onNavigate?: () => void; onReset: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} aria-label="Nexa website" className="w-fit rounded-md px-2 pt-1">
        <Logo size={26} />
      </Link>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-bg-deep/60 px-3 py-2.5">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-violet to-brand text-xs font-bold text-white">
          AP
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{WORKSPACE}</span>
          <span className="block text-xs text-faint">Demo workspace</span>
        </span>
      </div>
      <nav aria-label="Dashboard">
        <NavList current={current} onNavigate={onNavigate} />
      </nav>
      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-line bg-bg-deep/60 p-3.5 text-xs leading-relaxed text-muted">
          <p className="flex items-center gap-1.5 font-medium text-text">
            <Info className="size-3.5 text-cyan" aria-hidden="true" /> Demo mode
          </p>
          <p className="mt-1.5">Fictional data. Your changes are saved only in this browser.</p>
          <button type="button" onClick={onReset} className="mt-2.5 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md text-brand-text hover:text-text">
            <RotateCcw className="size-3.5" aria-hidden="true" /> Reset demo data
          </button>
        </div>
        <Link to="/" onClick={onNavigate} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-white/[0.04] hover:text-text">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to website
        </Link>
      </div>
    </div>
  )
}

export function AppShell({
  current,
  children,
  onOpenSearch,
  onNewTask,
}: {
  current: SectionId
  children: ReactNode
  onOpenSearch: () => void
  onNewTask: () => void
}) {
  const { dispatch } = useStore()
  const toast = useToast()
  const [drawer, setDrawer] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const drawerRef = useRef<HTMLDialogElement>(null)
  const label = SECTIONS.find((s) => s.id === current)!.label

  useEffect(() => {
    const d = drawerRef.current
    if (!d) return
    if (drawer && !d.open) d.showModal()
    if (!drawer && d.open) d.close()
  }, [drawer])

  // Close the drawer if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => mq.matches && setDrawer(false)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const askReset = () => {
    setDrawer(false)
    setConfirmReset(true)
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_1fr]">
      <a href="#app-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface-3 focus:px-4 focus:py-2.5">
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-surface/70 lg:block">
        <SidebarBody current={current} onReset={askReset} />
      </aside>

      <dialog
        ref={drawerRef}
        aria-label="Navigation"
        onClose={() => setDrawer(false)}
        className="m-0 h-dvh max-h-dvh w-[min(300px,86vw)] border-r border-line-strong bg-surface p-0 text-text backdrop:bg-bg-deep/70 backdrop:backdrop-blur-sm"
      >
        {drawer && (
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 grid size-10 cursor-pointer place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-text"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <SidebarBody current={current} onNavigate={() => setDrawer(false)} onReset={askReset} />
          </div>
        )}
      </dialog>

      <div className="min-w-0">
        <header className="glass sticky top-0 z-30 border-x-0 border-t-0">
          <div className="flex h-15 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open navigation"
              aria-haspopup="dialog"
              className="-ml-2 grid size-11 cursor-pointer place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-text lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <p className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
              <span className="truncate text-faint">{WORKSPACE}</span>
              <span className="text-line-strong" aria-hidden="true">
                /
              </span>
              <span className="truncate text-text">{label}</span>
            </p>
            <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-xs text-cyan sm:ml-1">DEMO</span>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenSearch}
                data-tour="search"
                className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-bg-deep/60 px-3 text-sm text-faint transition-colors hover:border-faint/50 hover:text-muted"
              >
                <Search className="size-4" aria-hidden="true" />
                <span className="hidden md:inline">Search or jump to…</span>
                <span className="sr-only md:hidden">Search</span>
                <kbd className="ml-4 hidden rounded border border-line-strong bg-surface-3 px-1.5 font-mono text-xs text-faint md:inline">⌘K</kbd>
              </button>
              <span className="hidden sm:block">
                <Button size="sm" onClick={onNewTask}>
                  <Plus className="size-4" aria-hidden="true" /> New task
                </Button>
              </span>
              <button type="button" onClick={onNewTask} aria-label="New task" className="grid size-10 cursor-pointer place-items-center rounded-lg bg-brand-strong text-white sm:hidden">
                <Plus className="size-5" aria-hidden="true" />
              </button>
              <span className="ml-1 hidden sm:block">
                <Avatar name="Maya Chen" hue={220} size={32} />
              </span>
            </div>
          </div>
        </header>

        <main id="app-main" className="mx-auto max-w-[1320px] px-4 pb-28 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-16">
          {children}
        </main>
      </div>

      {/* Bottom tab bar for phones */}
      <nav aria-label="Quick navigation" className="glass fixed inset-x-0 bottom-0 z-30 border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] sm:hidden">
        <ul className="grid grid-cols-5">
          {MOBILE_TABS.map((id) => {
            const s = SECTIONS.find((x) => x.id === id)!
            const Icon = s.icon
            const active = id === current
            return (
              <li key={id}>
                <Link
                  to={`/app/${id}`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-15 flex-col items-center justify-center gap-1 text-xs ${active ? 'text-text' : 'text-faint'}`}
                >
                  <Icon className={`size-5 ${active ? 'text-brand-text' : ''}`} aria-hidden="true" />
                  {id === 'assistant' ? 'Assistant' : id === 'automations' ? 'Flows' : s.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data?"
        description="This restores the original sample workspace. Tasks you created and changes you made in this browser will be cleared."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: 'reset' })
                setConfirmReset(false)
                toast('Demo data restored')
              }}
            >
              Reset demo
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">Nothing is stored on a server, so this only affects this browser.</p>
      </Dialog>
    </div>
  )
}
