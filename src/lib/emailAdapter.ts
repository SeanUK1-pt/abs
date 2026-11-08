import nodemailer from 'nodemailer'
import type { EmailAdapter } from 'payload'

// Sends Payload's own emails (admin password resets and similar) through the same
// SMTP settings the enquiry notifications use (Amazon SES on the server). If those
// settings are missing, returns undefined and Payload falls back to writing emails
// to the console, exactly as before.
export function smtpEmailAdapter(): EmailAdapter | undefined {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_PORT } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return undefined

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  const defaultFromAddress = SMTP_FROM || SMTP_USER
  const defaultFromName = 'Algarve Boat Sales'

  return () => ({
    name: 'smtp',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async message => {
      await transporter.sendMail({
        ...message,
        from: message.from ?? { name: defaultFromName, address: defaultFromAddress },
      })
    },
  })
}
