import { CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { navigate, useLocation } from '../lib/router.ts'
import { AppShell } from './AppShell.tsx'
import { CommandPalette } from './CommandPalette.tsx'
import { isSection, SECTIONS, type SectionId } from './labels.ts'
import { NewTaskDialog } from './NewTaskDialog.tsx'
import { Analytics } from './pages/Analytics.tsx'
import { Assistant } from './pages/Assistant.tsx'
import { Automations } from './pages/Automations.tsx'
import { Integrations } from './pages/Integrations.tsx'
import { Overview } from './pages/Overview.tsx'
import { Projects } from './pages/Projects.tsx'
import { Tasks } from './pages/Tasks.tsx'
import { StoreProvider } from './StoreProvider.tsx'
import { ToastContext } from './toast.ts'
import { Tour } from './Tour.tsx'

const PAGES: Record<SectionId, () => React.JSX.Element> = {
  overview: Overview,
  projects: Projects,
  tasks: Tasks,
  automations: Automations,
  analytics: Analytics,
  integrations: Integrations,
  assistant: Assistant,
}

export default function DashboardApp() {
  const { pathname, search } = useLocation()
  const raw = pathname.split('/')[2] ?? ''
  const section: SectionId = isSection(raw) ? raw : 'overview'
  const tour = Number(search.get('tour') ?? 0)
  const [palette, setPalette] = useState(false)
  const [newTask, setNewTask] = useState(false)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const timer = useRef<number>(0)

  // Unknown /app paths normalise to the overview.
  useEffect(() => {
    if (!isSection(raw)) navigate('/app/overview', { replace: true })
  }, [raw])

  useEffect(() => {
    document.title = `${SECTIONS.find((s) => s.id === section)!.label} · Nexa demo`
  }, [section])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const notify = useCallback((text: string) => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), text })
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const Page = PAGES[section]

  return (
    <StoreProvider>
      <ToastContext.Provider value={notify}>
        <AppShell current={section} onOpenSearch={() => setPalette(true)} onNewTask={() => setNewTask(true)}>
          <Page key={section} />
        </AppShell>
        {tour > 0 && <Tour step={tour} />}
        <CommandPalette open={palette} onClose={() => setPalette(false)} />
        <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} />
        <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
          {toast && (
            <p key={toast.id} className="fade-up flex items-center gap-2 rounded-full border border-line-strong bg-surface-3/95 px-4 py-2 text-sm shadow-xl backdrop-blur">
              <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
              {toast.text}
            </p>
          )}
        </div>
      </ToastContext.Provider>
    </StoreProvider>
  )
}
