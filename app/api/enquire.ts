/**
 * POST /api/enquire
 *
 * Handles enquiry form submissions:
 *  1. Validates input
 *  2. Stores lead in Supabase
 *  3. Sends notification email via Resend
 *
 * Required environment variables (set in Vercel dashboard):
 *   RESEND_API_KEY       — from resend.com
 *   RESEND_FROM          — e.g. "Legends <enquiries@legends.cars>"
 *   RESEND_NOTIFY_EMAIL  — where YOU want to be notified (your inbox)
 *   SUPABASE_URL         — your project URL from Supabase → Settings → API
 *   SUPABASE_SERVICE_KEY — service_role key (NOT anon) — never expose client-side
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory rate limit — best-effort per function instance.
const submissions = new Map<string, { count: number; resetAt: number }>()
const MAX_PER_HOUR = 5
const HOUR_MS      = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = submissions.get(ip)
  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + HOUR_MS })
    return false
  }
  if (entry.count >= MAX_PER_HOUR) return true
  entry.count++
  return false
}

/** Escape user-supplied strings before interpolating into HTML email templates. */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

interface EnquiryBody {
  car:     string
  name:    string
  email:   string
  phone?:  string
  message?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const origin = process.env.SITE_URL ?? 'https://legends.cars'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  // ── Method guard ──────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many submissions — please try again later' })
  }

  // ── Parse & validate ─────────────────────────────────────────────────────
  const { car, name, email, phone, message } = req.body as EnquiryBody

  // Type guards — req.body values could be anything at runtime
  if (typeof name !== 'string' || typeof email !== 'string')
    return res.status(400).json({ error: 'Invalid input' })
  if (!name.trim()) return res.status(400).json({ error: 'Name is required' })
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Valid email is required' })
  if (name.length > 120)    return res.status(400).json({ error: 'Name too long' })
  if (email.length > 254)   return res.status(400).json({ error: 'Email too long' })
  if (phone  && (typeof phone  !== 'string' || phone.length  > 30))
    return res.status(400).json({ error: 'Invalid phone' })
  if (message && (typeof message !== 'string' || message.length > 5000))
    return res.status(400).json({ error: 'Message too long' })
  if (car && typeof car !== 'string') return res.status(400).json({ error: 'Invalid car field' })

  const supabaseUrl        = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  const resendKey          = process.env.RESEND_API_KEY
  const resendFrom         = process.env.RESEND_FROM         ?? 'Legends <enquiries@legends.cars>'
  const notifyEmail        = process.env.RESEND_NOTIFY_EMAIL

  if (!supabaseUrl || !supabaseServiceKey || !resendKey || !notifyEmail) {
    console.error('Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // ── 1. Store in Supabase ──────────────────────────────────────────────────
  const dbRes = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':         supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify({
      car:     car ?? 'Unknown',
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      phone:   phone?.trim() || null,
      message: message?.trim() || null,
    }),
  })

  if (!dbRes.ok) {
    const txt = await dbRes.text()
    console.error('Supabase insert failed:', txt)
    return res.status(500).json({ error: 'Failed to save enquiry' })
  }

  // ── 2. Send notification email ────────────────────────────────────────────
  const emailRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    resendFrom,
      to:      [notifyEmail],
      subject: `New enquiry — ${(car ?? 'vehicle').replace(/[\r\n]/g, '')}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; color: #1a1a1a;">
          <h2 style="font-weight: 300; font-style: italic; margin-bottom: 4px;">New Enquiry</h2>
          <p style="font-size: 11px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0;">
            Legends Classic Automobiles
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="font-size: 13px; line-height: 2; color: #333;">
            <tr><td style="color: #999; padding-right: 16px; white-space: nowrap;">Vehicle</td><td><strong>${esc(car ?? '—')}</strong></td></tr>
            <tr><td style="color: #999; padding-right: 16px;">Name</td><td>${esc(name)}</td></tr>
            <tr><td style="color: #999; padding-right: 16px;">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="color: #999; padding-right: 16px;">Phone</td><td>${phone ? esc(phone) : '—'}</td></tr>
          </table>
          ${message ? `<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" /><p style="font-size: 13px; color: #555; line-height: 1.8;">${esc(message)}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #aaa;">
            View all leads at <a href="https://legends.cars/admin">legends.cars/admin</a>
          </p>
        </div>
      `,
      // Confirmation email to the buyer
      reply_to: email,
    }),
  })

  if (!emailRes.ok) {
    // Non-fatal — lead is already saved, just log the email failure
    console.error('Resend failed:', await emailRes.text())
  }

  // ── 3. Send confirmation to buyer ─────────────────────────────────────────
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    resendFrom,
      to:      [email],
      subject: `Your enquiry — ${car ?? 'Legends Classic Automobiles'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; color: #1a1a1a;">
          <h2 style="font-weight: 300; font-style: italic;">Thank you, ${esc(name)}.</h2>
          <p style="font-size: 13px; color: #666; line-height: 1.8;">
            Your enquiry about the <strong>${esc(car ?? 'vehicle')}</strong> has been received.
            We will be in touch at our earliest convenience — by appointment only.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #aaa; letter-spacing: 0.05em;">
            Legends Classic Automobiles &nbsp;·&nbsp; legends.cars
          </p>
        </div>
      `,
    }),
  }).catch(err => console.error('Buyer confirmation failed:', err))

  return res.status(200).json({ ok: true })
}
