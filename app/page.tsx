'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

const videoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4'

const navItems = ['EXPLORE', 'HOW IT WORKS', 'MY TRIPS']

function navHref(item: string) {
  if (item === 'EXPLORE') return '/explore'
  if (item === 'HOW IT WORKS') return '/how-it-works'
  return '/my-trips'
}

function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <a href="/" aria-label="RouteWeave home" className={`flex items-center gap-2 ${mobile ? 'relative z-50' : ''}`}>
      <svg className="h-6 w-6 fill-[#010101] lg:fill-white" viewBox="0 0 256 256" aria-hidden="true">
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-[#010101] lg:text-white">ROUTEWEAVE</span>
    </a>
  )
}

function GetStartedButton({ className = '', children = 'PLAN A TRIP →' }: { className?: string; children?: ReactNode }) {
  return (
    <a href="/planner" className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${className}`}>
      {children}
    </a>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-sans">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline src={videoUrl} aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          <Brand />
          <div className="hidden items-stretch gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {navItems.map((item) => (
                <a key={item} href={navHref(item)} className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  {item}{item === 'HOW IT WORKS' && <ChevronDown className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>
            <GetStartedButton className="self-stretch px-5" />
          </div>
          <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#010101] backdrop-blur-lg lg:text-white md:hidden">
            <Menu className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-90 scale-0 opacity-0' : ''}`} />
            <X className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
          </button>
        </nav>

        <div className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-2 px-6 pt-24">
            {navItems.map((item, index) => (
              <a key={item} href={navHref(item)} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white" style={{ transitionDelay: menuOpen ? `${(index + 1) * 60}ms` : '0ms', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateX(0)' : 'translateX(24px)', transition: 'opacity 400ms ease, transform 400ms ease, background-color 200ms ease, color 200ms ease' }}>
                {item}{item === 'HOW IT WORKS' && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
          </div>
          <div className="mt-auto px-6 pb-10" style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 400ms ease 300ms, transform 400ms ease 300ms' }}><GetStartedButton className="h-12 w-full" /></div>
        </aside>

        <main className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#010101] sm:text-4xl lg:text-[3.5rem] lg:text-white">TRAVEL PLANS<br />THAT ADAPT<br />WHILE YOU MOVE.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#010101]/75 lg:text-white/75">Build a personalized journey around your time, budget and interests.<br className="hidden sm:block" /> When reality changes, RouteWeave adapts your itinerary.</p>
            <GetStartedButton className="mt-6 px-6 py-3 sm:mt-8 sm:py-2.5">START PLANNING →</GetStartedButton>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
            <article className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:w-64 sm:p-6">
              <div>
                <div className="text-3xl font-normal tracking-tight text-[#010101] sm:text-4xl lg:text-white" style={{ fontFamily: "'Silkscreen', cursive" }}>₹30,000</div>
                <div className="mt-3 text-xs font-semibold tracking-[0.18em] text-[#010101]/70 lg:text-white/70">PLANNED BUDGET</div>
              </div>
              <p className="mt-8 text-sm leading-relaxed text-[#010101]/80 lg:text-white/80">Mumbai → Goa<br />4 DAYS · 2 TRAVELERS</p>
            </article>
            <article className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:w-64 sm:p-6">
              <div className="mb-3 flex items-center gap-2 sm:mb-4"><span className="text-base">⚡</span><span className="text-sm font-semibold text-[#010101] lg:text-white">LIVE JOURNEY INTELLIGENCE</span></div>
              <p className="text-sm font-medium leading-relaxed text-[#010101]/80 lg:text-white/80">Weather change detected</p>
              <div className="mt-4 text-xs font-semibold tracking-[0.18em] text-[#010101]/60 lg:text-white/60">GOA · DAY 02</div>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/80 lg:text-white/80">Outdoor activities affected.</p>
              <a href="/adapt" className="mt-5 inline-block text-xs font-semibold tracking-[0.14em] text-[#010101] transition-opacity hover:opacity-70 lg:text-white">ADAPTATION READY →</a>
            </article>
          </div>
        </main>
      </div>
    </section>
  )
}
