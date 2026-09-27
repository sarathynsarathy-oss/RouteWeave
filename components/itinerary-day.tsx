import { type Activity } from '@/lib/mock-trip'

export function ItineraryDay({
  day,
  date,
  label,
  activities,
}: {
  day: string
  date: string
  label: string
  activities: Activity[]
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-[0.18em] text-white">{day}</h2>
          <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-white/60">{date}</p>
        </div>
        <p className="text-xs font-medium text-white/60">{label}</p>
      </div>

      <ol className="mt-6 space-y-4">
        {activities.map((activity, index) => (
          <li key={`${day}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold tracking-wider text-white/70">
                {String(index + 1).padStart(2, '0')}
              </div>
              {index < activities.length - 1 && <div className="h-8 w-px bg-white/10" />}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-baseline gap-3">
                <time className="text-xs font-semibold tracking-[0.14em] text-white/80">{activity.time}</time>
                {activity.category && <span className="text-[10px] font-medium text-white/50">{activity.category}</span>}
              </div>
              <p className="mt-1 text-sm font-medium text-white">{activity.title}</p>
              {activity.description && <p className="mt-1 text-xs text-white/70">{activity.description}</p>}
              {activity.duration && <p className="mt-2 text-[10px] font-medium text-white/60">~ {activity.duration}</p>}
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
