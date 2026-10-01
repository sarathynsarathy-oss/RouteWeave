import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

function returnToSignIn(request: NextRequest) {
  return NextResponse.redirect(new URL('/signin?authError=1', request.url))
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!code || !url || !publishableKey) return returnToSignIn(request)

  const cookieStore = await cookies()
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return returnToSignIn(request)

  return NextResponse.redirect(new URL('/my-trips', request.url))
}