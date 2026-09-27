import Link from 'next/link'

export function AdaptationCTA() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-lg sm:flex sm:items-center sm:justify-between sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">TEST THE ADAPTATION</h2>
        <p className="mt-2 text-sm text-white/70">See how RouteWeave adapts your journey when reality changes—weather, disruptions, delays.</p>
      </div>
      <Link
        href="/adapt"
        className="mt-5 inline-flex items-center justify-center h-12 rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:mt-0"
      >
        ⚡ SIMULATE DISRUPTION
      </Link>
    </div>
  )
}
