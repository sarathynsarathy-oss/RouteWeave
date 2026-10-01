'use client'

import { useEffect, useState } from 'react'
import { AppShell, CtaLink } from '@/components/app-shell'
import { adaptationChecks, adaptationSteps, adaptedDay02, generateJourney, originalDay02, plannerDefaults, type JourneyTrip } from '@/lib/mock-trip'
import { adaptTrip, type AdaptationResult } from '@/lib/adaptation'
import { demoHeavyRainWeather, getDestinationWeather, type NormalizedWeather } from '@/lib/weather'
import { getActivityLocation } from '@/lib/activity-locations'
import { calculateRouteEfficiency, getRouteWithFallback, getOptimizedRouteWithFallback, type RouteResult } from '@/lib/routing'

export default function AdaptPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [adaptation, setAdaptation] = useState<AdaptationResult | null>(null)
  const [weather, setWeather] = useState<NormalizedWeather | null>(null)
  const [journey, setJourney] = useState<JourneyTrip | null>(null)
  const [adaptedRoute, setAdaptedRoute] = useState<RouteResult | null>(null)
  const analyzing = stepIndex < adaptationSteps.length

  useEffect(() => {
    const stored = sessionStorage.getItem('routeweave.currentJourney')
    let currentJourney = generateJourney(plannerDefaults)
    if (stored) {
      try {
        currentJourney = JSON.parse(stored) as JourneyTrip
      } catch {
        // Keep the deterministic demo journey when session data is invalid.
      }
    }
    const day02 = currentJourney.days.find((day) => day.day === 'DAY 02') || currentJourney.days[0]
    setJourney(currentJourney)
    void getDestinationWeather(currentJourney.to).then((currentWeather) => {
      const isDemoGoa = currentJourney.to.trim().toLowerCase() === 'goa'
      const adaptationWeather = isDemoGoa ? demoHeavyRainWeather : currentWeather
      const adaptationDay = isDemoGoa
        ? {
            ...(day02 || { day: 'DAY 02', date: '', label: 'Coastal Goa' }),
            activities: originalDay02.map((title) => ({ title, time: '', category: title === 'Night Market' ? 'Nightlife' : 'Outdoor' })),
          }
        : day02
      setWeather(adaptationWeather)
      if (adaptationDay) {
        const result = adaptTrip(currentJourney, adaptationWeather, adaptationDay)
        setAdaptation(result)
        const replacementLocations = ['Goa Hotel', ...result.replacementActivities]
          .map(getActivityLocation)
          .filter((location): location is NonNullable<typeof location> => Boolean(location))
        void Promise.all([getRouteWithFallback(replacementLocations), getOptimizedRouteWithFallback(replacementLocations)])
          .then(([updatedRoute, optimizedRoute]) => {
            const efficiency = calculateRouteEfficiency(updatedRoute, optimizedRoute)
            setAdaptedRoute(updatedRoute)
            const updatedDays = currentJourney.days.map((day) => day.day === adaptationDay.day
              ? {
                  ...day,
                  activities: result.replacementActivities.map((title, index) => ({
                    ...(adaptationDay.activities[index] || adaptationDay.activities[0]),
                    title,
                    category: 'Indoor',
                  })),
                }
              : day)
            const updatedJourney = {
              ...currentJourney,
              days: updatedDays,
              metrics: {
                ...currentJourney.metrics,
                routeEfficiency: efficiency,
                localRoute: { distanceKm: updatedRoute.distanceKm, durationMinutes: updatedRoute.durationMinutes, routeEfficiency: efficiency },
              },
            }
            setJourney(updatedJourney)
            sessionStorage.setItem('routeweave.currentJourney', JSON.stringify(updatedJourney))
            sessionStorage.setItem('routeweave.currentLocalRoute', JSON.stringify(updatedRoute))
          })
          .catch(() => {
            setAdaptedRoute(null)
          })
      }
    })
  }, [])

  useEffect(() => {
    if (!analyzing) return
    const timer = window.setTimeout(() => {
      setStepIndex((current) => current + 1)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [analyzing, stepIndex])

  return (
    <AppShell activeHref="/adapt" ctaHref="/trip/demo?adapted=1" ctaLabel="VIEW UPDATED JOURNEY →">
      <div className="mx-auto w-full max-w-5xl pt-2 sm:pt-4">
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <p className="text-sm font-semibold tracking-[0.14em] text-white">DISRUPTION DETECTED</p>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
            {weather?.description.toUpperCase() || 'HEAVY RAIN'}
          </h1>
          <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-white/60">{journey?.to.toUpperCase() || 'GOA'} · DAY 02</p>
        </div>

        {analyzing ? (
          <div className="mt-8 rounded-2xl bg-white/10 p-6 backdrop-blur-lg sm:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">ADAPTATION ENGINE</p>
            <ul className="mt-6 space-y-4">
              {adaptationSteps.map((step, index) => {
                const active = index === stepIndex
                const done = index < stepIndex
                return (
                  <li
                    key={step}
                    className={`flex items-center gap-3 text-sm font-medium tracking-[0.08em] transition-opacity duration-300 ${
                      active ? 'text-white' : done ? 'text-white/70' : 'text-white/30'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${active ? 'animate-pulse bg-white' : done ? 'bg-white/70' : 'bg-white/20'}`}
                    />
                    {step}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard title="ORIGINAL PLAN" items={adaptation?.affectedActivities.length ? adaptation.affectedActivities : originalDay02} muted />
              <PlanCard title="ADAPTED PLAN" items={adaptation?.replacementActivities.length ? adaptation.replacementActivities : adaptedDay02} />
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {(adaptation
                ? [...adaptationChecks, ...adaptation.reasons, ...(adaptedRoute ? [`Route: ${adaptedRoute.distanceKm} KM · ${adaptedRoute.durationMinutes} MINUTES`] : [])]
                : adaptationChecks
              ).map((check) => (
                <li
                  key={check}
                  className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-medium text-white/90 backdrop-blur-lg"
                >
                  ✓ {check}
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:flex sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">JOURNEY UPDATED</h2>
                <p className="mt-2 text-sm text-white/70">Day 02 is now indoor-first, with budget and interests intact.</p>
              </div>
              <CtaLink href="/trip/demo?adapted=1" className="mt-5 h-12 px-6 sm:mt-0">
                VIEW UPDATED JOURNEY →
              </CtaLink>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function PlanCard({ title, items, muted = false }: { title: string; items: readonly string[]; muted?: boolean }) {
  return (
    <article className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6">
      <h2 className="text-xs font-semibold tracking-[0.18em] text-white/70">{title}</h2>
      <ol className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li key={item} className={`flex items-center gap-3 text-sm ${muted ? 'text-white/60 line-through' : 'text-white'}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold tracking-wider text-white/70">
              {String(index + 1).padStart(2, '0')}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </article>
  )
}
