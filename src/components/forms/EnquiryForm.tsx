'use client'

import { useState } from 'react'
import styles from './EnquiryForm.module.css'

const L: Record<string, Record<string, string>> = {
  en: { name: 'Your Name *', email: 'Email Address *', phone: 'Phone Number', message: 'Message *', contact: 'Preferred contact:', send: 'Send Enquiry', sending: 'Sending...', success: "✅ Thank you! We'll be in touch shortly.", error: 'Something went wrong. Please try again.', email_c: '📧 Email', phone_c: '📞 Phone', whatsapp: '💬 WhatsApp' },
  pt: { name: 'O Seu Nome *', email: 'Email *', phone: 'Telefone', message: 'Mensagem *', contact: 'Contacto preferido:', send: 'Enviar Mensagem', sending: 'A enviar...', success: '✅ Obrigado! Entraremos em contacto brevemente.', error: 'Algo correu mal. Tente novamente.', email_c: '📧 Email', phone_c: '📞 Telefone', whatsapp: '💬 WhatsApp' },
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_title: listingTitle, listing_type: listingType, listing_id: listingId }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
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

      {status === 'error' && (
        <p className={styles.error}>{l.error}</p>
      )}

      <button type="submit" className={`btn btn-gold ${styles.submitBtn}`} disabled={status === 'sending'}>
        {status === 'sending' ? l.sending : l.send}
      </button>
    </form>
  )
}
