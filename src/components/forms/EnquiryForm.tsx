'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './EnquiryForm.module.css'

const L: Record<string, Record<string, string>> = {
  en: { name: 'Your Name *', email: 'Email Address *', phone: 'Phone Number', message: 'Message *', contact: 'Preferred contact:', send: 'Send Enquiry', sending: 'Sending...', success: "✅ Thank you! We'll be in touch shortly.", error: 'Something went wrong. Please try again.', email_c: '📧 Email', phone_c: '📞 Phone', whatsapp: '💬 WhatsApp' },
  pt: { name: 'O Seu Nome *', email: 'Email *', phone: 'Telefone', message: 'Mensagem *', contact: 'Contacto preferido:', send: 'Enviar Mensagem', sending: 'A enviar...', success: '✅ Obrigado! Entraremos em contacto brevemente.', error: 'Algo correu mal. Tente novamente.', email_c: '📧 Email', phone_c: '📞 Telefone', whatsapp: '💬 WhatsApp' },
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAE9FccSjbjK7_4PD'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

interface EnquiryFormProps {
  listingTitle: string
  listingType: 'boat' | 'trailer' | 'general'
  listingId?: string
  locale?: string
}

export function EnquiryForm({ listingTitle, listingType, listingId, locale = 'en' }: EnquiryFormProps) {
  const l = L[locale] || L.en
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in the ${listingTitle}. Please contact me with more details.`,
    contact_method: 'email',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [website, setWebsite] = useState('')
  const [renderedAt] = useState(() => Date.now())
  const [token, setToken] = useState('')
  const tsRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    function mount() {
      if (cancelled || !tsRef.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(tsRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        language: locale === 'pt' ? 'pt' : 'en',
        theme: 'dark',
        appearance: 'interaction-only',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      })
    }
    if (window.turnstile) {
      mount()
    } else {
      let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.id = 'cf-turnstile-script'
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', mount)
    }
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = undefined
    }
  }, [locale])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_title: listingTitle, listing_type: listingType, listing_id: listingId, website, ts: renderedAt, turnstile_token: token }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
      setToken('')
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.success}>
        <p>{l.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>

      <div className={styles.field}>
        <input
          type="text"
          placeholder={l.name}
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div className={styles.field}>
        <input
          type="email"
          placeholder={l.email}
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className={styles.field}>
        <input
          type="tel"
          placeholder={l.phone}
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
      </div>

      <div className={styles.field}>
        <textarea
          rows={4}
          placeholder={l.message}
          required
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />
      </div>

      <div className={styles.contactMethod}>
        <p>{l.contact}</p>
        <div className={styles.methodBtns}>
          {['email', 'phone', 'whatsapp'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setForm(f => ({ ...f, contact_method: m }))}
              className={`${styles.methodBtn} ${form.contact_method === m ? styles.methodActive : ''}`}
            >
              {m === 'email' ? l.email_c : m === 'phone' ? l.phone_c : l.whatsapp}
            </button>
          ))}
        </div>
      </div>

      <div ref={tsRef} />

      {status === 'error' && (
        <p className={styles.error}>{l.error}</p>
      )}

      <button type="submit" className={`btn btn-gold ${styles.submitBtn}`} disabled={status === 'sending' || !token}>
        {status === 'sending' ? l.sending : l.send}
      </button>
    </form>
  )
}
