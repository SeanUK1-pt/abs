// Pure helpers for the promotion setting (no database access, so they can be
// tested directly).

// Live = master switch on and, if a start/end is set, `now` is inside the window.
export function isLive(p: { enabled?: unknown; show_from?: unknown; show_until?: unknown } | null | undefined, now = Date.now()): boolean {
  if (!p?.enabled) return false
  if (p.show_from && new Date(p.show_from as string).getTime() > now) return false
  if (p.show_until && new Date(p.show_until as string).getTime() < now) return false
  return true
}

// Only site-relative paths or http(s) addresses are accepted as links, and a
// link needs both an address and some text.
export function cleanLink(url: unknown, label: unknown): { url: string; label: string } | null {
  const u = typeof url === 'string' ? url.trim() : ''
  const l = typeof label === 'string' ? label.trim() : ''
  const ok = /^\/(?!\/)/.test(u) || /^https?:\/\//i.test(u)
  return ok && l ? { url: u, label: l } : null
}
