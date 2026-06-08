import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !key) {
  console.warn(
    '[Auth] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured. ' +
    'Authentication features will be unavailable.'
  )
}

// Typed as nullable — all consumers must guard against null (auth disabled state)
export const supabase = (url && key) ? createClient(url, key) : null
