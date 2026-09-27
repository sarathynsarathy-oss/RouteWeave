import type { Interest, TravelStyle, JourneyTrip } from '@/lib/mock-trip'
import type { NormalizedWeather } from '@/lib/weather'

export type ItineraryActivity = {
  id: string
  name: string
  type: Interest | 'RELAXATION'
  location: string
  durationMinutes: number
  estimatedCost: number
  indoor: boolean
  coordinates?: { lat: number; lng: number }
}

export type ItineraryDay = {
  day: number
  date: string
  theme: string
  activities: ItineraryActivity[]
  estimatedDailyCost: number
}

export type ItineraryDocument = {
  tripTitle: string
  summary: string
  days: ItineraryDay[]
  totalEstimatedCost: number
  interestMatch: number
  reasoning: string
  routeMetrics?: {
    totalDistanceKm: number
    totalDurationMinutes: number
    efficiencyScore: number
  }
}

export type ItineraryInput = {
  from: string
  to: string
  departure: string
  returnDate: string
  travelers: number
  budget: number
  interests: Interest[]
  style: TravelStyle
  weather: Pick<NormalizedWeather, 'description' | 'severity' | 'precipitationProbability'>
}

export type ItineraryGenerationResult = {
  journey: JourneyTrip
  document: ItineraryDocument
  source: 'ai' | 'fallback' | 'demo'
  status: string
}