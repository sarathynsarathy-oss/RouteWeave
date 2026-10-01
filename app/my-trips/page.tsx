'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { AppShell } from '@/components/app-shell'
import { formatInr, listSavedTrips, saveTrips, type SavedTrip } from '@/lib/mock-trip'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function MyTripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setTrips(listSavedTrips())

    const supabase = createSupabaseBrowserClient()
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
  }, [])

  const accountLabel = typeof user?.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name
    : user?.email

  function createTrip() {
    const demoTrip: SavedTrip = {
      id: `trip-${Date.now()}`,
      title: 'New Adventure',
      route: 'Mumbai → Goa',
      dates: '08 Oct - 11 Oct',
      travelers: 2,
      budget: 30000,
      createdAt: new Date().toISOString(),
    }

    const nextTrips = [demoTrip, ...trips]
    setTrips(nextTrips)
    saveTrips(nextTrips)
    router.push('/planner')
  }

  return (
    <AppShell activeHref="/my-trips" ctaHref="/planner" ctaLabel="CREATE NEW TRIP →">
      <div className="mx-auto w-full max-w-5xl pt-2 sm:pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">MY TRIPS</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
              SAVED JOURNEYS.
            </h1>
            {accountLabel && <p className="mt-3 text-sm text-white/65">Signed in as {accountLabel}</p>}
          </div>
          <button
            type="button"
            onClick={createTrip}
            className="h-12 rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + CREATE NEW TRIP
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <article key={trip.id} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60">{trip.title}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{trip.route}</h2>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <p>{trip.dates}</p>
                <p>{trip.travelers} travelers</p>
                <p>{formatInr(trip.budget)}</p>
              </div>
              <div className="mt-5 flex gap-3">
                <Link href="/trip/demo" className="rounded-full bg-white px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#010101]">
                  VIEW
                </Link>
                <Link href="/planner" className="rounded-full border border-white/20 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-white/80">
                  EDIT
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
