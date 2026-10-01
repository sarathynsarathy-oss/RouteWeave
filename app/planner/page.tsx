'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { PlannerForm } from '@/components/planner-form'
import { GenerationLoading } from '@/components/generation-loading'
import { plannerDefaults, type Interest, type JourneyTrip, type TravelStyle } from '@/lib/mock-trip'
import { generateDeterministicItinerary } from '@/lib/intelligence/itinerary-engine'
import { getDestinationWeather } from '@/lib/weather'

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <AppShell activeHref="/planner" ctaHref="/my-trips" ctaLabel="MY TRIPS →">
          <div className="mx-auto w-full max-w-4xl pt-2 sm:pt-4" />
        </AppShell>
      }
    >
      <PlannerContent />
    </Suspense>
  )
}

function PlannerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [from, setFrom] = useState(plannerDefaults.from)
  const [to, setTo] = useState(plannerDefaults.to)
  const [departure, setDeparture] = useState(plannerDefaults.departure)
  const [returnDate, setReturnDate] = useState(plannerDefaults.returnDate)
  const [travelers, setTravelers] = useState(plannerDefaults.travelers)
  const [budget, setBudget] = useState(plannerDefaults.budget)
  const [interests, setInterests] = useState<Interest[]>(plannerDefaults.interests)
  const [style, setStyle] = useState<TravelStyle>(plannerDefaults.style)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const destination = searchParams.get('destination')
    if (destination) {
      setTo(destination)
    }
  }, [searchParams])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)

    const input = {
      from,
      to,
      departure,
      returnDate,
      travelers,
      budget,
      interests,
      style,
    }
    const weather = await getDestinationWeather(to)
    const generation = fetch('/api/itinerary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, weather }),
    }).then(async (response) => {
      if (!response.ok) throw new Error('Itinerary API unavailable')
      return (await response.json()) as { journey: JourneyTrip }
    }).catch(() => {
      const fallback = generateDeterministicItinerary({ ...input, weather })
      fallback.journey.intelligence = { source: 'fallback', status: 'Using RouteWeave fallback intelligence' }
      return fallback
    })

    const [result] = await Promise.all([generation, new Promise((resolve) => window.setTimeout(resolve, 3200))])
    sessionStorage.setItem('routeweave.currentJourney', JSON.stringify(result.journey))
    sessionStorage.removeItem('routeweave.currentRoute')
    sessionStorage.removeItem('routeweave.currentLocalRoute')
    router.push('/trip/demo')
  }

  return (
    <>
      {submitting && <GenerationLoading />}
      <AppShell activeHref="/planner" ctaHref="/my-trips" ctaLabel="MY TRIPS →">
        <div className="mx-auto w-full max-w-4xl pt-2 sm:pt-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60">ADAPTIVE PLANNER</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
            PLAN YOUR JOURNEY.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
            Tell RouteWeave where you're going, how you're traveling, and what matters to you. We'll weave a personalized itinerary.
          </p>

          <PlannerForm
            from={from}
            to={to}
            departure={departure}
            returnDate={returnDate}
            travelers={travelers}
            budget={budget}
            interests={interests}
            style={style}
            onFromChange={setFrom}
            onToChange={setTo}
            onDepartureChange={setDeparture}
            onReturnDateChange={setReturnDate}
            onTravelersChange={setTravelers}
            onBudgetChange={setBudget}
            onInterestsChange={setInterests}
            onStyleChange={setStyle}
            onSubmit={onSubmit}
            isSubmitting={submitting}
          />
        </div>
      </AppShell>
    </>
  )
}

