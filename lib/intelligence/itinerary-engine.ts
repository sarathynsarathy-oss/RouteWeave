import type { Activity, Interest, ItineraryDay as JourneyDay, JourneyTrip } from '@/lib/mock-trip'
import { formatInr } from '@/lib/mock-trip'
import type { ItineraryActivity, ItineraryDay, ItineraryDocument, ItineraryInput } from './itinerary-types'

const GOA_CATALOG: Array<ItineraryActivity & { interests: Interest[] }> = [
  { id: 'baga-beach', name: 'Baga Beach', type: 'BEACHES', interests: ['BEACHES', 'NATURE'], location: 'Baga Beach', durationMinutes: 120, estimatedCost: 500, indoor: false, coordinates: { lat: 15.5557, lng: 73.7517 } },
  { id: 'fort-aguada', name: 'Fort Aguada', type: 'CULTURE', interests: ['CULTURE', 'NATURE'], location: 'Fort Aguada', durationMinutes: 90, estimatedCost: 300, indoor: false, coordinates: { lat: 15.492, lng: 73.7739 } },
  { id: 'sunset-point', name: 'Sunset Point', type: 'NATURE', interests: ['NATURE', 'BEACHES'], location: 'Sunset Point', durationMinutes: 60, estimatedCost: 0, indoor: false, coordinates: { lat: 15.4767, lng: 73.8078 } },
  { id: 'goa-state-museum', name: 'Goa State Museum', type: 'CULTURE', interests: ['CULTURE'], location: 'Goa State Museum', durationMinutes: 90, estimatedCost: 100, indoor: true, coordinates: { lat: 15.4989, lng: 73.8278 } },
  { id: 'local-food', name: 'Local Food Experience', type: 'FOOD', interests: ['FOOD'], location: 'Panaji Food Quarter', durationMinutes: 120, estimatedCost: 1200, indoor: true, coordinates: { lat: 15.501, lng: 73.83 } },
  { id: 'indoor-culture', name: 'Indoor Cultural Experience', type: 'CULTURE', interests: ['CULTURE'], location: 'Panaji Cultural Centre', durationMinutes: 120, estimatedCost: 400, indoor: true, coordinates: { lat: 15.489, lng: 73.827 } },
  { id: 'dinner', name: 'Dinner', type: 'FOOD', interests: ['FOOD', 'NIGHTLIFE'], location: 'Panaji', durationMinutes: 90, estimatedCost: 1400, indoor: true, coordinates: { lat: 15.5267, lng: 73.8271 } },
  { id: 'night-market', name: 'Night Market', type: 'SHOPPING', interests: ['SHOPPING', 'NIGHTLIFE'], location: 'North Goa Market', durationMinutes: 120, estimatedCost: 900, indoor: false, coordinates: { lat: 15.5267, lng: 73.8271 } },
]

function daysBetween(departure: string, returnDate: string) {
  const start = new Date(departure || '2026-10-08').getTime()
  const end = new Date(returnDate || '2026-10-11').getTime()
  return Math.max(2, Math.min(7, Math.floor((end - start) / 86400000) + 1))
}

function dateFor(input: ItineraryInput, offset: number) {
  const date = new Date(input.departure || '2026-10-08')
  date.setDate(date.getDate() + offset)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function selectActivities(input: ItineraryInput, day: number): ItineraryActivity[] {
  const rainy = input.weather.severity === 'HIGH' || input.weather.description.toLowerCase().includes('rain')
  const catalog = input.to.trim().toLowerCase() === 'goa'
    ? GOA_CATALOG
    : input.interests.map((interest, index) => ({
        id: `${interest.toLowerCase()}-${index}`,
        name: `${input.to} ${interest.toLowerCase().replace('_', ' ')} experience`,
        type: interest,
        interests: [interest],
        location: input.to,
        durationMinutes: 90,
        estimatedCost: interest === 'FOOD' ? 900 : 300,
        indoor: ['FOOD', 'CULTURE', 'SHOPPING', 'NIGHTLIFE'].includes(interest),
      }))
  const selected = catalog.filter((activity) => activity.interests.some((interest) => input.interests.includes(interest)))
  const safe = selected.filter((activity) => !rainy || activity.indoor)
  const pool = safe.length ? safe : catalog.filter((activity) => activity.indoor)
  const count = input.style === 'RELAXED' ? 2 : input.style === 'FAST-PACED' ? 4 : 3
  const offset = (day - 1) % Math.max(pool.length, 1)
  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => pool[(offset + index) % pool.length])
}

function toDocument(input: ItineraryInput): ItineraryDocument {
  const dayCount = daysBetween(input.departure, input.returnDate)
  const days: ItineraryDay[] = Array.from({ length: dayCount }, (_, index) => {
    const activities = selectActivities(input, index + 1)
    return {
      day: index + 1,
      date: dateFor(input, index),
      theme: index === 0 ? 'Arrival & first impressions' : input.weather.severity === 'HIGH' ? 'Indoor-first exploration' : 'Local exploration & experiences',
      activities,
      estimatedDailyCost: activities.reduce((total, activity) => total + activity.estimatedCost * input.travelers, 0),
    }
  })
  const totalActivitiesCost = days.reduce((total, day) => total + day.estimatedDailyCost, 0)
  const transportBuffer = Math.round(input.budget * 0.12)
  const totalEstimatedCost = Math.min(input.budget, totalActivitiesCost + transportBuffer)
  const matchingActivities = days.flatMap((day) => day.activities).filter((activity) => input.interests.includes(activity.type as Interest))
  const totalActivities = days.reduce((total, day) => total + day.activities.length, 0)
  const interestMatch = totalActivities ? Math.round((matchingActivities.length / totalActivities) * 100) : 0
  return {
    tripTitle: `${input.to} ${input.style.toLowerCase()} escape`,
    summary: `A ${input.style.toLowerCase()} itinerary shaped around ${input.interests.join(', ').toLowerCase()} with weather-aware pacing.`,
    days,
    totalEstimatedCost,
    interestMatch,
    reasoning: input.weather.severity === 'HIGH' ? 'Outdoor activities were reduced because current weather conditions favor indoor alternatives.' : 'Activities were clustered by interest and paced for the selected travel style.',
  }
}

function toJourneyTrip(input: ItineraryInput, document: ItineraryDocument): JourneyTrip {
  const days: JourneyDay[] = document.days.map((day) => ({
    day: `DAY ${String(day.day).padStart(2, '0')}`,
    date: day.date,
    label: day.theme,
    activities: day.activities.map((activity, index): Activity => ({
      time: `${String(9 + index * 3).padStart(2, '0')}:00`,
      title: activity.name,
      category: activity.type,
      duration: `${Math.round(activity.durationMinutes / 60)}h`,
      description: `${activity.location} · estimate ${formatInr(activity.estimatedCost)} per traveler`,
      latitude: activity.coordinates?.lat,
      longitude: activity.coordinates?.lng,
    })),
  }))
  return {
    id: `trip-${input.from.toLowerCase()}-${input.to.toLowerCase()}`,
    from: input.from,
    to: input.to,
    departureDate: input.departure,
    returnDate: input.returnDate,
    travelers: input.travelers,
    budget: input.budget,
    interests: input.interests,
    travelStyle: input.style,
    generatedAt: new Date().toISOString(),
    days,
    metrics: {
      budgetUsed: document.totalEstimatedCost,
      routeEfficiency: 88,
      interestMatch: document.interestMatch,
      weather: input.weather.description,
    },
  }
}

export function generateDeterministicItinerary(input: ItineraryInput) {
  const document = toDocument(input)
  return { document, journey: toJourneyTrip(input, document) }
}

export function normalizeItinerary(value: unknown): ItineraryDocument | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<ItineraryDocument>
  if (typeof candidate.tripTitle !== 'string' || !Array.isArray(candidate.days) || typeof candidate.totalEstimatedCost !== 'number' || !Number.isFinite(candidate.totalEstimatedCost)) return null
  const days = candidate.days.slice(0, 4)
    .map((day) => {
      if (!day || typeof day !== 'object' || !Array.isArray(day.activities)) return null
      const activities = day.activities.filter((activity): activity is ItineraryActivity => Boolean(
        activity && typeof activity === 'object' &&
        typeof activity.name === 'string' && typeof activity.location === 'string' &&
        Number.isFinite(activity.durationMinutes) && Number.isFinite(activity.estimatedCost) &&
        typeof activity.indoor === 'boolean',
      )).slice(0, 4)
      if (!activities.length) return null
      return {
        day: Number.isFinite(day.day) ? day.day : 1,
        date: typeof day.date === 'string' ? day.date : '',
        theme: typeof day.theme === 'string' ? day.theme : 'Local exploration',
        activities,
        estimatedDailyCost: Number.isFinite(day.estimatedDailyCost) ? day.estimatedDailyCost : activities.reduce((sum, activity) => sum + activity.estimatedCost, 0),
      }
    })
    .filter((day): day is ItineraryDay => Boolean(day))
  if (!days.length) return null
  return {
    tripTitle: candidate.tripTitle,
    summary: typeof candidate.summary === 'string' ? candidate.summary : 'Weather-aware RouteWeave itinerary.',
    days,
    totalEstimatedCost: Math.max(0, candidate.totalEstimatedCost),
    interestMatch: Math.max(0, Math.min(100, Number(candidate.interestMatch) || 0)),
    reasoning: typeof candidate.reasoning === 'string' ? candidate.reasoning : 'Structured itinerary generated from the available trip constraints.',
  }
}

export function documentToJourney(input: ItineraryInput, document: ItineraryDocument) {
  return toJourneyTrip(input, document)
}