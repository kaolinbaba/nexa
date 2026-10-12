import { X } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

/* ---------------- Badge ---------------- */
export type Tone = 'neutral' | 'brand' | 'violet' | 'cyan' | 'success' | 'warning' | 'danger'
const toneClass: Record<Tone, string> = {
  neutral: 'border-line-strong bg-white/[0.03] text-muted',
  brand: 'border-brand/30 bg-brand/10 text-brand-text',
  violet: 'border-violet/35 bg-violet/10 text-violet-text',
  cyan: 'border-cyan/30 bg-cyan/10 text-cyan',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
}
export function Badge({ tone = 'neutral', dot, children, className = '' }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[tone]} ${className}`}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, hue, size = 28 }: { name: string; hue: number; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
  return (
    <span
      title={name}
      className="inline-grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-bg"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, size * 0.4),
        background: `linear-gradient(140deg, hsl(${hue} 70% 52%), hsl(${hue + 40} 65% 38%))`,
      }}
    >
      <span aria-hidden="true">{initials}</span>
      <span className="sr-only">{name}</span>
    </span>
  )
}

/* ---------------- Switch ---------------- */
export function Switch({ checked, onChange, label, describedBy }: { checked: boolean; onChange: (v: boolean) => void; label: string; describedBy?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ${
        checked ? 'border-brand/60 bg-brand-strong' : 'border-line-strong bg-surface-3'
      }`}
    >
      <span
        aria-hidden="true"
        className={`ml-0.5 size-5.5 rounded-full bg-text shadow-sm transition-transform duration-200 ease-[var(--ease-out-expo)] ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  )
}

/* ---------------- Tabs (ARIA tabs with roving focus) ---------------- */
export type TabItem<T extends string> = { id: T; label: ReactNode; count?: number }
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  idBase,
  variant = 'underline',
}: {
  items: TabItem<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  idBase: string
  variant?: 'underline' | 'segmented'
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    let next = -1
    if (dir) next = (i + dir + items.length) % items.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = items.length - 1
    if (next < 0) return
    e.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].id)
  }
  const seg = variant === 'segmented'
  return (
    <div
      role="tablist"
      aria-label={label}
      className={
        seg
          ? 'inline-flex rounded-lg border border-line bg-bg-deep/60 p-1'
          : 'scrollbar-none flex gap-1 overflow-x-auto border-b border-line'
      }
    >
      {items.map((t, i) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`${idBase}-tab-${t.id}`}
            aria-selected={active}
            aria-controls={`${idBase}-panel`}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange(t.id)}
            className={
              seg
                ? `min-h-9 cursor-pointer rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                    active ? 'bg-surface-3 text-text shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]' : 'text-muted hover:text-text'
                  }`
                : `relative -mb-px inline-flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                    active ? 'border-brand text-text' : 'border-transparent text-muted hover:text-text'
                  }`
            }
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`rounded-md px-1.5 font-mono text-xs ${active ? 'bg-brand/15 text-brand-text' : 'bg-white/5 text-faint'}`}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Dialog (native <dialog>: focus trap, Esc, inert background for free) ---------------- */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descId = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    // Backdrop click is a pointer convenience; keyboard users close with Esc or the close button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl border border-line-strong bg-surface p-0 text-text shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-bg-deep/70 backdrop:backdrop-blur-sm`}
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div>
              <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-sm text-muted">
                  {description}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="-mr-2 -mt-1 grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-text" aria-label="Close dialog">
              <X className="size-4.5" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}
