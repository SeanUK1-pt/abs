import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, contact_method, listing_title, listing_type, listing_id } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL,
          subject: `New Enquiry: ${listing_title || 'General'}`,
          html: `
            <h2>New Boat Enquiry</h2>
            <p><strong>Listing:</strong> ${listing_title || 'General'}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Preferred Contact:</strong> ${contact_method}</p>
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
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
