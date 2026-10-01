'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthExperience({ mode }: { mode: 'signin' | 'signup' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [authError, setAuthError] = useState('')
  const [connecting, setConnecting] = useState(false)
  const isSignup = mode === 'signup'

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('authError')) {
      setAuthError('Google sign-in did not complete. Please try again.')
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setAuthError('')
    setNotice('Email and password sign-in is not connected yet.')
  }

  async function handleGoogleSignIn() {
    setNotice('')
    setAuthError('')

    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setAuthError('Google sign-in is not configured on this deployment.')
      return
    }

    setConnecting(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setConnecting(false)
        setAuthError('Google sign-in could not be started. Please try again.')
      }
    } catch {
      setConnecting(false)
      setAuthError('Google sign-in could not be started. Please try again.')
    }
  }

  return (
    <AppShell activeHref={isSignup ? '/signup' : '/signin'}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center py-6 sm:py-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <section className="max-w-xl py-4 text-white sm:py-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/65">ROUTEWEAVE</p>
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-white/75">PLAN • EXPLORE • ADAPT</p>
            <h1 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Your journey starts here.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              Create a personalized journey around your time, budget and interests, then adapt it when reality changes.
            </p>
            <div className="mt-8 max-w-md rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg transition-colors hover:bg-white/[0.13] sm:p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span aria-hidden="true">⚡</span>
                <span>JOURNEY INTELLIGENCE</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Your travel plan is designed to adapt when conditions change.
              </p>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-black/35 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {isSignup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {isSignup ? 'Start planning journeys that adapt with you.' : 'Continue your journey with RouteWeave.'}
            </p>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={connecting}
              className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] text-sm font-medium text-white transition-colors hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-wait disabled:opacity-70"
            >
              <span aria-hidden="true" className="font-semibold text-base">G</span>
              {connecting ? 'CONNECTING...' : 'Continue with Google'}
            </button>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-white/15" />
              <span className="text-[10px] font-semibold tracking-[0.18em] text-white/45">OR</span>
              <span className="h-px flex-1 bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-white/85">
                Email address
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/25 focus:border-white/55 focus:ring-2 focus:ring-white/10 invalid:[&:not(:placeholder-shown)]:border-rose-300/60"
                />
              </label>

              <label className="block text-sm font-medium text-white/85">
                Password
                <span className="relative mt-2 block">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/25 focus:border-white/55 focus:ring-2 focus:ring-white/10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              {!isSignup && (
                <div className="-mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setNotice('Password recovery is not available in this MVP.')}
                    className="text-xs font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-[#111] transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {isSignup ? 'CREATE ACCOUNT →' : 'SIGN IN →'}
              </button>
            </form>

            {authError && <p role="alert" className="mt-4 text-center text-xs leading-relaxed text-rose-200">{authError}</p>}
            {notice && <p role="status" className="mt-4 text-center text-xs leading-relaxed text-white/65">{notice}</p>}

            <p className="mt-6 text-center text-sm text-white/65">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link href={isSignup ? '/signin' : '/signup'} className="font-medium text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white">
                {isSignup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  )
}