'use client'

import { FormEvent, type ReactNode } from 'react'
import { INTERESTS, TRAVEL_STYLES, type Interest, type TravelStyle } from '@/lib/mock-trip'

export function PlannerForm({
  from,
  to,
  departure,
  returnDate,
  travelers,
  budget,
  interests,
  style,
  onFromChange,
  onToChange,
  onDepartureChange,
  onReturnDateChange,
  onTravelersChange,
  onBudgetChange,
  onInterestsChange,
  onStyleChange,
  onSubmit,
  isSubmitting,
}: {
  from: string
  to: string
  departure: string
  returnDate: string
  travelers: number
  budget: number
  interests: Interest[]
  style: TravelStyle
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onDepartureChange: (value: string) => void
  onReturnDateChange: (value: string) => void
  onTravelersChange: (value: number) => void
  onBudgetChange: (value: number) => void
  onInterestsChange: (interests: Interest[]) => void
  onStyleChange: (style: TravelStyle) => void
  onSubmit: (e: FormEvent) => void
  isSubmitting: boolean
}) {
  function toggleInterest(interest: Interest) {
    onInterestsChange(
      interests.includes(interest) ? interests.filter((i) => i !== interest) : [...interests, interest],
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <FormSection title="A. ROUTE">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="FROM">
            <input
              required
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              placeholder="e.g. Mumbai"
              className={inputClass}
            />
          </FormField>
          <FormField label="TO">
            <input
              required
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              placeholder="e.g. Goa"
              className={inputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="B. TRIP DATES">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="DEPARTURE">
            <input
              required
              type="date"
              value={departure}
              onChange={(e) => onDepartureChange(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="RETURN">
            <input
              required
              type="date"
              value={returnDate}
              onChange={(e) => onReturnDateChange(e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="C. TRAVELERS">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onTravelersChange(count)}
              aria-pressed={travelers === count}
              className={`rounded-full px-4 py-2 text-sm font-semibold tracking-[0.12em] transition-colors ${
                travelers === count ? 'bg-white text-[#010101]' : 'border border-white/20 bg-black/20 text-white hover:bg-white/10'
              }`}
            >
              {count}{count === 4 ? '+' : ''}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/70">{travelers} traveler{travelers > 1 ? 's' : ''}</p>
      </FormSection>

      <FormSection title="D. BUDGET">
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/70">₹</span>
            <input
              required
              min={0}
              type="number"
              value={budget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="flex-1 bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/40"
            />
          </div>
          <p className="mt-3 text-xs font-semibold tracking-[0.18em] text-white/60">TOTAL BUDGET</p>
        </div>
      </FormSection>

      <FormSection title="E. INTERESTS">
        <div className="mt-4 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={selected}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] transition-colors ${
                  selected ? 'bg-white text-[#010101]' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </FormSection>

      <FormSection title="F. TRAVEL STYLE">
        <div className="grid gap-2 sm:grid-cols-3">
          {TRAVEL_STYLES.map((option) => {
            const selected = style === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => onStyleChange(option)}
                aria-pressed={selected}
                className={`rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.08em] transition-colors ${
                  selected ? 'bg-white text-[#010101]' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </FormSection>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-full bg-gradient-to-b from-[#2B2B2B] to-[#101010] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? 'GENERATING JOURNEY...' : 'G. GENERATE MY JOURNEY →'}
      </button>
    </form>
  )
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-white/60">{title}</p>
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6">{children}</div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-[0.18em] text-white/70">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg bg-black/40 px-3 py-2 text-base font-medium text-white outline-none placeholder:text-white/40 transition focus:bg-black/60 focus:ring-1 focus:ring-white/30 [color-scheme:dark]'
