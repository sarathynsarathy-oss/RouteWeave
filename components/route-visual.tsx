import type { RouteResult } from '@/lib/routing'

export function RouteVisual({ from, to, route }: { from: string; to: string; route?: RouteResult | null }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg sm:p-8">
      <p className="text-xs font-semibold tracking-[0.18em] text-white/60">ROUTE OVERVIEW</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="rounded-2xl bg-white/5 px-4 py-6 text-center">
            <p className="text-sm font-medium text-white/70">DEPARTURE</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{from}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-16" />
          <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-16" />
        </div>

        <div className="flex-1">
          <div className="rounded-2xl bg-white/5 px-4 py-6 text-center">
            <p className="text-sm font-medium text-white/70">DESTINATION</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{to}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/70">Your journey is optimized for route efficiency and interest match.</p>
      {route && (
        <div className="mt-5 border-t border-white/10 pt-5 text-center text-xs font-semibold tracking-[0.12em] text-white/60">
          <p>{route.coordinates.map((coordinate) => coordinate.label).filter(Boolean).join(' → ')}</p>
          <p className="mt-2 text-white/80">{route.distanceKm} KM · {route.durationMinutes} MINUTES</p>
        </div>
      )}
    </article>
  )
}
