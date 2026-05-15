import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    throw new Error('Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Please update your .env.local file.')
  }

  if (!supabaseKey || supabaseKey === 'your-supabase-anon-key') {
    throw new Error('Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY. Please update your .env.local file.')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
