/**
 * GET /api/leads
 *
 * Returns all enquiry leads from Supabase — used by the /admin dashboard.
 * Protected by a simple password check (ADMIN_PASSWORD env var).
 *
 * Required environment variables (set in Vercel dashboard):
 *   SUPABASE_URL         — your Supabase project URL
 *   SUPABASE_SERVICE_KEY — service_role key (full read access)
 *   ADMIN_PASSWORD       — arbitrary secret password for the admin UI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const origin = process.env.SITE_URL ?? 'https://legends.cars'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Auth guard ─────────────────────────────────────────────────────────────
  // ADMIN_API_TOKEN must always be set in Vercel env — if missing, fail closed.
  const adminToken = process.env.ADMIN_API_TOKEN
  if (!adminToken) {
    console.error('ADMIN_API_TOKEN is not set — rejecting all requests')
    return res.status(503).json({ error: 'Admin endpoint not configured' })
  }
  const authHeader = req.headers['authorization'] ?? ''
  const provided   = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (provided !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl        = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const dbRes = await fetch(
    `${supabaseUrl}/rest/v1/enquiries?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey':         supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
    },
  )

  if (!dbRes.ok) {
    return res.status(500).json({ error: 'Failed to fetch leads' })
  }

  const data = await dbRes.json()
  return res.status(200).json(data)
}
