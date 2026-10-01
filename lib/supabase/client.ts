import { createBrowserClient } from '@supabase/ssr'

type BrowserDatabase = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

let browserClient: ReturnType<typeof createBrowserClient<BrowserDatabase>> | null = null

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) return null

  browserClient ??= createBrowserClient<BrowserDatabase>(url, publishableKey)
  return browserClient
}