export function IntelligenceCard({
  label,
  value,
  sublabel,
}: {
  label: string
  value: string | number
  sublabel?: string
}) {
  return (
    <article className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6">
      <div className="text-2xl font-normal tracking-tight text-white sm:text-3xl" style={{ fontFamily: "'Silkscreen', cursive" }}>
        {value}
      </div>
      <div className="mt-3 text-xs font-semibold tracking-[0.18em] text-white/70">{label}</div>
      {sublabel && <div className="mt-2 text-[10px] font-medium tracking-[0.12em] text-white/60">{sublabel}</div>}
    </article>
  )
}
