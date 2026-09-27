'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { IntelligenceCard } from '@/components/intelligence-card'
import { ItineraryDay } from '@/components/itinerary-day'
import { RouteVisual } from '@/components/route-visual'
import { AdaptationCTA } from '@/components/adaptation-cta'
import { formatInr, type JourneyTrip } from '@/lib/mock-trip'
import { getDestinationWeather, type NormalizedWeather } from '@/lib/weather'
import { getActivityLocation } from '@/lib/activity-locations'
import { calculateRouteEfficiency, getMultiStopRoute, getOptimizedRoute, type RouteResult } from '@/lib/routing'

export default function TripDemoPage() {
  return (
    <Suspense
      fallback={
        <AppShell activeHref="/trip/demo">
          <p className="pt-8 text-sm text-white/70">Loading journey…</p>
        </AppShell>
      }
    >
      <TripDashboard />
    </Suspense>
  )
}

function TripDashboard() {
  const searchParams = useSearchParams()
  const adapted = searchParams.get('adapted') === '1'
  const [journey, setJourney] = useState<JourneyTrip | null>(null)
  const [weather, setWeather] = useState<NormalizedWeather | null>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routeEfficiency, setRouteEfficiency] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = sessionStorage.getItem('routeweave.currentJourney')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as JourneyTrip
        setJourney(parsed)
        void getDestinationWeather(parsed.to).then(setWeather)
        let adaptedRouteLoaded = false
        if (adapted) {
          const storedRoute = sessionStorage.getItem('routeweave.currentRoute')
          if (storedRoute) {
            try {
              setRoute(JSON.parse(storedRoute) as RouteResult)
              setRouteEfficiency(parsed.metrics.route?.routeEfficiency ?? parsed.metrics.routeEfficiency)
              adaptedRouteLoaded = true
            } catch {
              // Recalculate the original route when adapted route data is invalid.
            }
          }
        }
        if (!adaptedRouteLoaded) {
          const activityLocations = (parsed.days[1]?.activities || parsed.days.flatMap((day) => day.activities))
            .map((activity) => activity.latitude !== undefined && activity.longitude !== undefined
              ? { label: activity.title, latitude: activity.latitude, longitude: activity.longitude }
              : getActivityLocation(activity.title))
            .filter((location): location is NonNullable<typeof location> => Boolean(location))
          const locations = [getActivityLocation('Goa Hotel'), ...activityLocations]
            .filter((location): location is NonNullable<typeof location> => Boolean(location))
          void (locations.length >= 2 ? Promise.all([getMultiStopRoute(locations), getOptimizedRoute(locations)]) : Promise.reject(new Error('No route coordinates available')))
            .then(([currentRoute, optimizedRoute]) => {
              setRoute(currentRoute)
              setRouteEfficiency(calculateRouteEfficiency(currentRoute, optimizedRoute))
            })
            .catch(() => {
              setRoute(null)
              setRouteEfficiency(null)
            })
        }
      } catch (e) {
        console.error('Failed to parse journey:', e)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <AppShell activeHref="/trip/demo">
        <p className="pt-8 text-sm text-white/70">Loading journey…</p>
      </AppShell>
    )
  }

  if (!journey) {
    return (
      <AppShell activeHref="/trip/demo">
        <div className="pt-8 text-sm text-white/70">
          <p>No journey found. Please create a trip from the planner.</p>
        </div>
      </AppShell>
    )
  }

  const departureDate = new Date(journey.departureDate)
  const returnDate = new Date(journey.returnDate)
  const dateRange = `${departureDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — ${returnDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`

  return (
    <AppShell activeHref="/trip/demo" ctaHref="/adapt" ctaLabel="⚡ SIMULATE DISRUPTION">
      <div className="mx-auto w-full max-w-6xl pt-2 sm:pt-4 space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60">TRIP DASHBOARD</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
                {journey.from} → {journey.to}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {dateRange}
                <br />
                {journey.travelers} traveler{journey.travelers > 1 ? 's' : ''} · {formatInr(journey.budget)}
              </p>
              {adapted && (
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-white">JOURNEY UPDATED · DAY 02 ADAPTED</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <IntelligenceCard label="BUDGET" value={`${formatInr(journey.metrics.budgetUsed)} / ${formatInr(journey.budget)}`} sublabel={`${Math.round((journey.metrics.budgetUsed / journey.budget) * 100)}% USED`} />
          <IntelligenceCard label="ROUTE EFFICIENCY" value={`${routeEfficiency ?? journey.metrics.routeEfficiency}%`} />
          <IntelligenceCard label="TOTAL DISTANCE" value={route ? `${route.distanceKm} KM` : 'Unavailable'} />
          <IntelligenceCard label="TOTAL TRAVEL TIME" value={route ? `${route.durationMinutes} MIN` : 'Unavailable'} />
          <IntelligenceCard label="INTEREST MATCH" value={`${journey.metrics.interestMatch}%`} />
          <IntelligenceCard
            label="WEATHER"
            value={weather?.isFallback ? 'Unavailable' : weather ? `${weather.temperature}°C · ${weather.description}` : 'Loading...'}
            sublabel={weather?.isFallback ? 'WEATHER DATA UNAVAILABLE' : weather?.destination.toUpperCase()}
          />
        </div>
        {journey.intelligence && <p className="text-xs tracking-[0.12em] text-white/60">{journey.intelligence.status.toUpperCase()}</p>}

        <RouteVisual from={journey.from} to={journey.to} route={route} />

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60 mb-4">YOUR ITINERARY</p>
          <div className="grid gap-4 md:grid-cols-2">
            {journey.days.map((day) => (
              <ItineraryDay key={day.day} day={day.day} date={day.date} label={day.label} activities={day.activities} />
            ))}
          </div>
        </div>

        <AdaptationCTA />
      </div>
    </AppShell>
  )
}
