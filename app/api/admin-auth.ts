/**
 * POST /api/admin-auth
 *
 * Validates the admin password (server-side only env var) and returns
 * the API token used to authenticate subsequent /api/leads requests.
 *
 * This keeps ADMIN_PASSWORD and ADMIN_API_TOKEN out of the client bundle —
 * no VITE_ prefix means they are never embedded in the JS served to browsers.
 *
 * Required environment variables (Vercel dashboard only — never in .env):
 *   ADMIN_PASSWORD   — password the admin types in the UI
 *   ADMIN_API_TOKEN  — bearer token used by /api/leads (can be the same value)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory rate limit — best-effort per function instance.
// For cross-instance protection add @upstash/ratelimit + Vercel KV.
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 10
const WINDOW_MS    = 15 * 60 * 1000 // 15 minutes

function isLocked(ip: string): boolean {
  const now  = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= MAX_ATTEMPTS) return true
  entry.count++
  return false
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = process.env.SITE_URL ?? 'https://legends.cars'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown'
  if (isLocked(ip)) return res.status(429).json({ error: 'Too many attempts — try again later' })

  const { password } = req.body as { password?: unknown }
  if (typeof password !== 'string' || !password)
    return res.status(400).json({ error: 'Password required' })

  const expected = process.env.ADMIN_PASSWORD
  const token    = process.env.ADMIN_API_TOKEN ?? expected

  if (!expected || !token) return res.status(500).json({ error: 'Auth not configured' })

  if (password !== expected) return res.status(401).json({ error: 'Incorrect password' })

  // Clear failed attempts on success
  attempts.delete(ip)
  return res.status(200).json({ token })
}
