import type { ReactNode } from 'react'

/** Page heading row used by every dashboard section (the page's single <h1>). */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.95rem] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ title, action, children, className = '', bodyClass = 'p-5', id }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string; id?: string }) {
  return (
    <section className={`panel min-w-0 ${className}`} aria-labelledby={title && id ? id : undefined}>
      {(title || action) && (
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          {title && (
            <h2 id={id} className="text-[0.95rem] font-medium">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

export function Stat({ label, value, note, icon, accent = 'text-brand-text' }: { label: string; value: ReactNode; note?: ReactNode; icon?: ReactNode; accent?: string }) {
  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 text-[0.8125rem] text-muted sm:text-sm">
        <span>{label}</span>
        {icon && <span className={accent}>{icon}</span>}
      </div>
      <div className="mt-3 font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] sm:text-[1.9rem]">{value}</div>
      {note && <div className="mt-2.5 text-xs text-faint">{note}</div>}
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-text">{label}</span>
      {children}
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'min-h-11 w-full rounded-lg border border-line-strong bg-bg-deep px-3 text-[0.95rem] text-text placeholder:text-faint transition-colors focus:border-brand'
