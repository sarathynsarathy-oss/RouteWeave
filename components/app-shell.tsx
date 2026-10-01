'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { HERO_VIDEO_URL } from '@/lib/mock-trip'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'EXPLORE', href: '/explore' },
  { label: 'HOW IT WORKS', href: '/how-it-works' },
  { label: 'ABOUT US', href: '/about' },
]

function Brand() {
  return (
    <Link href="/" aria-label="RouteWeave home" className="relative z-50 flex items-center gap-2">
      <svg className="h-6 w-6 fill-white" viewBox="0 0 256 256" aria-hidden="true">
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-white">ROUTEWEAVE</span>
    </Link>
  )
}

export function CtaLink({
  href,
  className = '',
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </Link>
  )
}

export function AppShell({
  children,
  activeHref,
  ctaHref = '/planner',
  ctaLabel = 'PLAN A TRIP →',
}: {
  children: ReactNode
  activeHref?: string
  ctaHref?: string
  ctaLabel?: string
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')

  const accountLabel = typeof user?.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name
    : user?.email
  const links = [
    ...navItems,
    ...(authReady
      ? user
        ? [{ label: 'MY TRIPS', href: '/my-trips' }]
        : [{ label: 'SIGN IN', href: '/signin' }, { label: 'SIGN UP', href: '/signup' }]
      : []),
  ]

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setAuthReady(true)
      return
    }

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null)
        setAuthReady(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthReady(true)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError('Sign out could not be completed. Please try again.')
      return
    }

    setAuthError('')
    setMenuOpen(false)
    router.push('/signin')
    router.refresh()
  }

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden bg-black font-sans">
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={HERO_VIDEO_URL}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/45" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          <Brand />
          <div className="hidden items-stretch gap-2 lg:flex xl:gap-3">
            <div className="flex items-center gap-0.5 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg xl:gap-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10 hover:text-white xl:px-4 xl:text-sm ${
                    item.href === '/signup'
                      ? 'border border-white/20 bg-white/15 text-white hover:bg-white/25'
                      : activeHref === item.href
                        ? 'bg-white/15 text-white'
                        : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <>
                  <span title={accountLabel ?? undefined} className="max-w-32 truncate px-2.5 py-1.5 text-xs text-white/60 xl:px-3">
                    {accountLabel}
                  </span>
                  <button type="button" onClick={handleSignOut} className="rounded-full px-2.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white xl:px-3 xl:text-sm">
                    SIGN OUT
                  </button>
                </>
              )}
            </div>
            <CtaLink href={ctaHref} className="self-stretch px-5">
              {ctaLabel}
            </CtaLink>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg lg:hidden"
          >
            <Menu className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-90 scale-0 opacity-0' : ''}`} />
            <X className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
          </button>
        </nav>

        {authError && <p role="alert" className="px-5 text-right text-xs text-rose-200 sm:px-8 lg:px-12">{authError}</p>}

        <div
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-2 px-6 pt-24">
            {links.map((item, index) => {
              const delay = menuOpen ? `${(index + 1) * 60}ms` : '0ms'
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
                    transition: `opacity 400ms ease ${delay}, transform 400ms ease ${delay}, background-color 200ms ease ${delay}, color 200ms ease ${delay}`,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
            {user && (
              <>
                <span className="truncate px-4 py-3 text-sm text-white/55">{accountLabel}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl px-4 py-3.5 text-left text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  SIGN OUT
                </button>
              </>
            )}
          </div>
          <div
            className="mt-auto px-6 pb-10"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 400ms ease 300ms, transform 400ms ease 300ms',
            }}
          >
            <CtaLink href={ctaHref} className="h-12 w-full">
              {ctaLabel}
            </CtaLink>
          </div>
        </aside>

        <main className="flex flex-1 flex-col px-5 pb-10 sm:px-8 lg:px-12 lg:pb-16">{children}</main>
      </div>
    </section>
  )
}
