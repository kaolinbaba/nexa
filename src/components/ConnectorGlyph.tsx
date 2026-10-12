import { BookOpen, Braces, Calendar, Code2, CreditCard, Folder, Mail, MessageSquare, PenTool, Table2, Users, Webhook } from 'lucide-react'
import type { Connector } from '../app/data.ts'

const map = {
  chat: MessageSquare,
  code: Code2,
  folder: Folder,
  pen: PenTool,
  users: Users,
  book: BookOpen,
  card: CreditCard,
  mail: Mail,
  calendar: Calendar,
  webhook: Webhook,
  table: Table2,
  braces: Braces,
} satisfies Record<Connector['glyph'], unknown>

export function ConnectorGlyph({ glyph, className = 'size-4.5' }: { glyph: Connector['glyph']; className?: string }) {
  const Icon = map[glyph]
  return <Icon className={className} aria-hidden="true" />
}
