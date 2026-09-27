'use client'

import { useEffect, useState } from 'react'

const steps = ['WEAVING YOUR ROUTE...', 'ANALYZING DESTINATION...', 'CHECKING WEATHER...', 'OPTIMIZING ACTIVITIES...', 'BALANCING BUDGET...', 'FINALIZING JOURNEY...']

export function GenerationLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= steps.length) return

    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, 800)

    return () => window.clearTimeout(timer)
  }, [currentStep])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl sm:p-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i < currentStep ? 'bg-white/80' : i === currentStep ? 'animate-pulse bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="h-20 min-h-20">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className={`text-center transition-opacity duration-300 ${
                    i === currentStep ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <p className="text-sm font-semibold tracking-[0.14em] text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
