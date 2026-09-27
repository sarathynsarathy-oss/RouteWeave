'use client'

import { AppShell } from '@/components/app-shell'

const steps = [
  {
    title: 'EXPLORE',
    description: 'Browse destinations by vibe, budget fit, and interests so your trip starts with something you actually want.',
  },
  {
    title: 'PLAN',
    description: 'Map the route, dates, travelers, and budget into a trip that balances timing, comfort, and itinerary goals.',
  },
  {
    title: 'ADAPT',
    description: 'When weather, delays, or local disruptions hit, RouteWeave swaps activities while preserving budget and route flow.',
  },
]

export default function HowItWorksPage() {
  return (
    <AppShell activeHref="/how-it-works" ctaHref="/planner" ctaLabel="START PLANNING →">
      <div className="mx-auto w-full max-w-5xl pt-2 sm:pt-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/60">HOW IT WORKS</p>
        <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
          PLAN → EXPLORE → ADAPT.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
          RouteWeave is a demo travel planning flow designed to help users shape a trip, discover the vibe they want, and react when conditions change.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.18em] text-white/60">0{index + 1}</span>
                <span className="text-lg text-white/80">{index === 0 ? '✦' : index === 1 ? '◎' : '⚡'}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-lg sm:p-8">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-white/60">WHY ROUTEWEAVE</h2>
          <ul className="mt-5 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
            <li className="rounded-2xl bg-black/20 px-4 py-3">Budget-aware suggestions instead of one-size-fits-all plans.</li>
            <li className="rounded-2xl bg-black/20 px-4 py-3">Weather-aware adaptation for rain, route changes, and timing issues.</li>
            <li className="rounded-2xl bg-black/20 px-4 py-3">Themed destination matching based on interests, pace, and trip goals.</li>
            <li className="rounded-2xl bg-black/20 px-4 py-3">A fast demo flow that works without a backend or API keys.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
