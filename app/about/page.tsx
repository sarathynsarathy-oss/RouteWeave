import Link from 'next/link'
import { AppShell, CtaLink } from '@/components/app-shell'

const approach = [
  {
    number: '01',
    title: 'PLAN',
    description: 'Build a personalized journey around your destination, budget, dates, travelers and interests.',
  },
  {
    number: '02',
    title: 'EXPLORE',
    description: 'Discover destinations and experiences that match the way you want to travel.',
  },
  {
    number: '03',
    title: 'ADAPT',
    description: 'When conditions change, RouteWeave can rethink affected activities and routes instead of forcing you to start over.',
  },
]

const considerations = [
  { icon: '📍', title: 'DESTINATION', description: "Where you're going." },
  { icon: '💰', title: 'BUDGET', description: 'How much you want to spend.' },
  { icon: '👥', title: 'TRAVELERS', description: "Who you're traveling with." },
  { icon: '❤️', title: 'INTERESTS', description: 'What you actually enjoy.' },
  { icon: '⏱️', title: 'TRAVEL STYLE', description: 'Relaxed, balanced or fast-paced.' },
  { icon: '🗺️', title: 'ROUTE', description: 'Efficient movement between experiences.' },
]

const capabilities = [
  'Personalized trip planning',
  'Budget-aware itinerary structure',
  'Interest-based planning',
  'Route optimization',
  'Multi-stop route intelligence',
  'Disruption simulation',
  'Adaptive itinerary replacement',
  'Original vs adapted journey comparison',
]

export default function AboutPage() {
  return (
    <AppShell activeHref="/about">
      <div className="mx-auto w-full max-w-6xl pb-8">
        <section className="flex min-h-[55vh] flex-col justify-center py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60">ABOUT ROUTEWEAVE</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Travel plans shouldn&apos;t stop adapting when the journey begins.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            RouteWeave is an adaptive AI travel planning platform designed to create personalized journeys and adjust them when real-world conditions change.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/planner" className="h-12 px-6">PLAN A TRIP →</CtaLink>
            <Link href="/explore" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white transition-colors hover:bg-white/15">
              EXPLORE →
            </Link>
          </div>
        </section>

        <section className="grid gap-8 border-t border-white/15 py-12 sm:py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white/55">THE PROBLEM</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Travel is dynamic.</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-sm leading-relaxed text-white/75 backdrop-blur-lg sm:p-7 sm:text-base">
            <p>
              Traditional itinerary planners create static plans. But weather changes, activities become unavailable, routes shift, and travelers change their plans.
            </p>
            <p className="mt-4 font-medium text-white">RouteWeave is designed around that reality.</p>
          </div>
        </section>

        <section className="border-t border-white/15 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/55">OUR APPROACH</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">PLAN • EXPLORE • ADAPT</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {approach.map((item) => (
              <article key={item.number} className="group rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg transition-colors hover:border-white/20 hover:bg-white/[0.13] sm:p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/50">{item.number}</p>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/15 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/55">WHAT ROUTEWEAVE CONSIDERS</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {considerations.map((item) => (
              <article key={item.title} className="flex min-h-28 items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-lg transition-colors hover:bg-white/[0.13] sm:p-5">
                <span aria-hidden="true" className="text-xl">{item.icon}</span>
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-white/85">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative my-4 overflow-hidden rounded-3xl border border-white/10 bg-black/35 px-5 py-16 text-center backdrop-blur-lg sm:my-8 sm:px-10 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/55">THE IDEA</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Your itinerary is not a checklist.
          </h2>
          <p className="mt-4 text-base text-white/70 sm:text-xl">It&apos;s a journey that should respond to reality.</p>
        </section>

        <section className="grid gap-8 border-t border-white/15 py-12 sm:py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white/55">CURRENT MVP</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built around the journey.</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <li key={capability} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-lg">
                {capability}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 border-t border-white/15 py-12 sm:flex-row sm:items-center sm:py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to plan differently?</h2>
          <CtaLink href="/planner" className="h-12 px-6">START PLANNING →</CtaLink>
        </section>
      </div>
    </AppShell>
  )
}