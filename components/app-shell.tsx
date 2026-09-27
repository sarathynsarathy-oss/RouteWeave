'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { HERO_VIDEO_URL } from '@/lib/mock-trip'

const navItems = [
  { label: 'EXPLORE', href: '/explore' },
  { label: 'HOW IT WORKS', href: '/how-it-works' },
  { label: 'PLANNER', href: '/planner' },
  { label: 'MY TRIPS', href: '/my-trips' },
  { label: 'ADAPT', href: '/adapt' },
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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
          <div className="hidden items-stretch gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${
                    activeHref === item.href ? 'bg-white/15 text-white' : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
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
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg md:hidden"
          >
            <Menu className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-90 scale-0 opacity-0' : ''}`} />
            <X className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
          </button>
        </nav>

        <div
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-2 px-6 pt-24">
            {navItems.map((item, index) => {
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
