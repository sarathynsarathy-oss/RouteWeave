'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { DESTINATION_CATEGORIES, DESTINATIONS, type DestinationCategory } from '@/lib/mock-trip'

export default function ExplorePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'ALL'>('ALL')
  const [selectedName, setSelectedName] = useState('Goa')

  const destinations = useMemo(() => {
    const query = search.trim().toLowerCase()
    return DESTINATIONS.filter((destination) => {
      const matchesCategory = selectedCategory === 'ALL' || destination.categories.includes(selectedCategory)
      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.region.toLowerCase().includes(query) ||
        destination.description.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  return (
    <AppShell activeHref="/explore" ctaHref="/planner" ctaLabel="PLAN A TRIP →">
      <div className="mx-auto w-full max-w-6xl pt-2 sm:pt-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/60">DESTINATION DISCOVERY</p>
        <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
          FIND YOUR NEXT ROUTE.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
          Explore destinations made for your budget, pace, and travel interests. Pick a place and continue to the planner.
        </p>

        <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-lg sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex-1">
              <span className="sr-only">Search destinations</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search destinations or regions"
                className="w-full rounded-full border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/40"
              />
            </label>
            <button
              type="button"
              onClick={() => router.push(`/planner?destination=${encodeURIComponent(selectedName)}`)}
              className="h-12 rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              CONTINUE TO PLANNER →
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {DESTINATION_CATEGORIES.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-2 text-[10px] font-semibold tracking-[0.14em] transition-colors ${
                    active ? 'bg-white text-[#010101]' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => {
            const active = selectedName === destination.name
            return (
              <article
                key={destination.name}
                className={`rounded-3xl border p-5 backdrop-blur-lg transition-all sm:p-6 ${
                  active ? 'border-white/55 bg-white/15 shadow-lg shadow-black/20' : 'border-white/10 bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-white/60">{destination.region}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{destination.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedName(destination.name)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] ${
                      active ? 'border-white bg-white text-[#010101]' : 'border-white/20 bg-black/20 text-white/80'
                    }`}
                  >
                    {active ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/75">{destination.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {destination.categories.map((category) => (
                    <span key={`${destination.name}-${category}`} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-white/75">
                      {category}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-black/20 p-3">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/60">BEST FOR</p>
                  <p className="mt-2 text-sm text-white/85">{destination.bestFor.join(' · ')}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-white/60">Vibe: {destination.vibe}</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/planner?destination=${encodeURIComponent(destination.name)}`)}
                    className="rounded-full bg-white px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#010101] transition-opacity hover:opacity-85"
                  >
                    PLAN HERE →
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
