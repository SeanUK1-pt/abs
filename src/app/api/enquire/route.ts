import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const MIN_FILL_MS = 3000
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 3
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(k)
  }
  return recent.length > RATE_MAX
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function looksLikeSpam(name: string, message: string): boolean {
  const links = (message.match(/https?:\/\/|www\./gi) || []).length
  if (links > 3) return true
  if (/https?:\/\/|www\./i.test(name)) return true
  return false
}

async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('TURNSTILE_SECRET_KEY not set — skipping CAPTCHA verification')
    return true
  }
  if (typeof token !== 'string' || !token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, ...(ip !== 'unknown' ? { remoteip: ip } : {}) }),
    })
    const data = await res.json()
    return data.success === true
  } catch (e) {
    console.error('Turnstile verify failed:', e)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, contact_method, listing_title, listing_type, listing_id, website, ts, turnstile_token } = body

    // Bots fill the hidden honeypot or submit instantly. Pretend success so they don't adapt.
    const tooFast = typeof ts === 'number' ? Date.now() - ts < MIN_FILL_MS : true
    if (website || tooFast) return NextResponse.json({ success: true })

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' || !name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (name.length > 100 || email.length > 200 || message.length > 3000 || String(phone || '').length > 40) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    if (!(await verifyTurnstile(turnstile_token, ip))) {
      return NextResponse.json({ error: 'CAPTCHA failed' }, { status: 400 })
    }

    if (looksLikeSpam(name, message)) return NextResponse.json({ success: true })

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'enquiries',
      data: {
        name,
        email,
        phone: phone || '',
        message,
        contact_method: contact_method || 'email',
        listing_title: listing_title || '',
        listing_type: listing_type || 'general',
        listing_id: listing_id || '',
      },
    })

    // Send email notification if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.CONTACT_EMAIL) {
      try {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        await transporter.sendMail({
          from: `Sales Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          replyTo: `${name.replace(/[\r\n<>"]/g, '')} <${email}>`,
          to: process.env.CONTACT_EMAIL,
          subject: `New Enquiry: ${String(listing_title || 'General').replace(/[\r\n]/g, ' ')}`,
          html: `
            <h2>New Boat Enquiry</h2>
            <p><strong>Listing:</strong> ${esc(String(listing_title || 'General'))}</p>
            <p><strong>Name:</strong> ${esc(name)}</p>
            <p><strong>Email:</strong> ${esc(email)}</p>
            <p><strong>Phone:</strong> ${esc(String(phone || 'Not provided'))}</p>
            <p><strong>Preferred Contact:</strong> ${esc(String(contact_method || 'email'))}</p>
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${esc(message).replace(/\n/g, '<br/>')}</p>
          `,
        })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
