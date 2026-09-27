export const INTERESTS = [
  'BEACHES',
  'FOOD',
  'CULTURE',
  'ADVENTURE',
  'NIGHTLIFE',
  'NATURE',
  'SHOPPING',
] as const

export const TRAVEL_STYLES = ['RELAXED', 'BALANCED', 'FAST-PACED'] as const

export type Interest = (typeof INTERESTS)[number]
export type TravelStyle = (typeof TRAVEL_STYLES)[number]

export type Activity = {
  time: string
  title: string
  category?: string
  duration?: string
  description?: string
  latitude?: number
  longitude?: number
}

export type ItineraryDay = {
  day: string
  date: string
  label: string
  activities: Activity[]
}

export type JourneyTrip = {
  id: string
  from: string
  to: string
  departureDate: string
  returnDate: string
  travelers: number
  budget: number
  interests: Interest[]
  travelStyle: TravelStyle
  generatedAt: string
  days: ItineraryDay[]
  metrics: {
    budgetUsed: number
    routeEfficiency: number
    interestMatch: number
    weather: string
    route?: {
      distanceKm: number
      durationMinutes: number
      routeEfficiency: number
    }
  }
  intelligence?: {
    source: 'ai' | 'fallback' | 'demo'
    status: string
  }
}

export type Disruption = {
  id: string
  type: 'weather' | 'transport' | 'accommodation' | 'activity'
  severity: 'low' | 'medium' | 'high'
  condition: string
  location: string
  day: number
  affectedActivities: string[]
}

export type ItineraryStop = {
  title: string
}

export const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4'

export const demoTrip = {
  from: 'Mumbai',
  to: 'Goa',
  departure: '08 OCT',
  return: '11 OCT',
  travelers: 2,
  budgetTotal: 30000,
  budgetUsed: 24600,
  routeEfficiency: 92,
  interestMatch: 94,
  weather: 'Partly cloudy',
  days: [
    {
      day: 'DAY 01',
      label: 'Mumbai → Goa',
      stops: [{ title: 'Mumbai → Goa' }, { title: 'Check-in' }, { title: 'Beach' }, { title: 'Dinner' }],
    },
    {
      day: 'DAY 02',
      label: 'Coastal Goa',
      stops: [{ title: 'Baga Beach' }, { title: 'Fort Aguada' }, { title: 'Sunset' }, { title: 'Night Market' }],
    },
    {
      day: 'DAY 03',
      label: 'City & night',
      stops: [{ title: 'Food experience' }, { title: 'Culture' }, { title: 'Nightlife' }],
    },
    {
      day: 'DAY 04',
      label: 'Return',
      stops: [{ title: 'Breakfast' }, { title: 'Checkout' }, { title: 'Return' }],
    },
  ] satisfies { day: string; label: string; stops: ItineraryStop[] }[],
}

export const originalDay02 = ['Baga Beach', 'Fort Aguada', 'Sunset', 'Night Market'] as const

export const adaptedDay02 = [
  'Goa State Museum',
  'Local Food Experience',
  'Indoor Cultural Experience',
  'Dinner',
] as const

export const adaptationSteps = [
  'ANALYZING CONDITIONS...',
  'CHECKING ACTIVITIES...',
  'OPTIMIZING ROUTE...',
  'PRESERVING BUDGET...',
  'UPDATING JOURNEY...',
] as const

export const adaptationChecks = [
  'Budget preserved',
  'Interests preserved',
  'Outdoor activities replaced',
  'Route recalculated',
] as const

export const plannerDefaults = {
  from: 'Mumbai',
  to: 'Goa',
  departure: '2026-10-08',
  returnDate: '2026-10-11',
  travelers: 2,
  budget: 30000,
  interests: ['BEACHES', 'FOOD', 'CULTURE'] as Interest[],
  style: 'BALANCED' as TravelStyle,
}

export const DESTINATION_CATEGORIES = ['ALL', 'BEACHES', 'FOOD', 'CULTURE', 'ADVENTURE', 'NIGHTLIFE', 'NATURE'] as const
export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number]

export type Destination = {
  name: string
  region: string
  description: string
  categories: DestinationCategory[]
  bestFor: string[]
  vibe: string
}

export const DESTINATIONS: Destination[] = [
  {
    name: 'Goa',
    region: 'Western India',
    description: 'Sun-soaked beaches, seafood, and relaxed coastal energy with easy multi-day planning.',
    categories: ['BEACHES', 'FOOD', 'NATURE', 'NIGHTLIFE'],
    bestFor: ['Beach hopping', 'Night markets', 'Sunset sessions'],
    vibe: 'Coastal & easygoing',
  },
  {
    name: 'Mumbai',
    region: 'Western India',
    description: 'A resilient metropolis with iconic heritage, food streets, and quick transfers.',
    categories: ['FOOD', 'CULTURE', 'NIGHTLIFE'],
    bestFor: ['Street food', 'Marine Drive', 'Heritage walks'],
    vibe: 'Fast-paced & vibrant',
  },
  {
    name: 'Jaipur',
    region: 'North India',
    description: 'Royal forts, market lanes, and colorful architecture built for culture-first trips.',
    categories: ['CULTURE', 'FOOD', 'NATURE'],
    bestFor: ['Palace visits', 'Rooftop dinners', 'Shopping'],
    vibe: 'Historic & colorful',
  },
  {
    name: 'Manali',
    region: 'Himalayan foothills',
    description: 'Mountain air, cafes, and valley adventures shaped for scenic, active getaways.',
    categories: ['ADVENTURE', 'NATURE', 'FOOD'],
    bestFor: ['Trekking', 'Snow views', 'Nature trails'],
    vibe: 'Cool & adventurous',
  },
  {
    name: 'Munnar',
    region: 'Kerala',
    description: 'Tea gardens, misty hills, and calm walks for slow, scenic breaks.',
    categories: ['NATURE', 'ADVENTURE', 'FOOD'],
    bestFor: ['Tea estate walks', 'Scenic drives', 'Nature escapes'],
    vibe: 'Misty & serene',
  },
  {
    name: 'Varanasi',
    region: 'North India',
    description: 'Spiritual ghats, temple energy, and deeply rooted culture with a memorable evening rhythm.',
    categories: ['CULTURE', 'FOOD', 'NATURE'],
    bestFor: ['Sunrise walks', 'Ganga aarti', 'Local food'],
    vibe: 'Sacred & atmospheric',
  },
]

export const SAVED_TRIPS_KEY = 'routeweave.savedTrips'

export type SavedTrip = {
  id: string
  title: string
  route: string
  dates: string
  travelers: number
  budget: number
  createdAt: string
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function generateJourney(input: {
  from: string
  to: string
  departure: string
  returnDate: string
  travelers: number
  budget: number
  interests: Interest[]
  style: TravelStyle
}): JourneyTrip {
  const normalizedBudget = Math.max(Number(input.budget) || 0, 30000)
  const departureDate = new Date(input.departure || '2026-10-08')
  const returnDate = new Date(input.returnDate || '2026-10-11')
  const tripDays = Math.max(2, Math.min(7, Math.floor((returnDate.getTime() - departureDate.getTime()) / 86400000)))

  const budgetUsed = Math.round(normalizedBudget * 0.82)
  const routeEfficiency = 88 + (input.style === 'FAST-PACED' ? 5 : input.style === 'RELAXED' ? 3 : 6)
  const interestMatch = 90 + (input.interests.length > 2 ? 4 : 2)

  const hasBeaches = input.interests.includes('BEACHES')
  const hasFood = input.interests.includes('FOOD')
  const hasCulture = input.interests.includes('CULTURE')
  const hasNightlife = input.interests.includes('NIGHTLIFE')

  const isRelaxed = input.style === 'RELAXED'
  const isFastPaced = input.style === 'FAST-PACED'

  const day01Activities: Activity[] = [
    { time: '10:00', title: `Arrive in ${input.to}`, category: 'Transport', duration: '2h' },
    { time: '13:00', title: `Local ${input.to} Lunch`, category: hasFood ? 'Food' : 'Meal', duration: '1h' },
    ...(!isFastPaced ? [{ time: '15:00', title: hasBeaches ? 'Beach or Local Attraction' : 'Local Exploration', category: 'Leisure', duration: '2h' }] : []),
    { time: isFastPaced ? '15:30' : '18:00', title: 'Sunset or Evening Stroll', category: 'Leisure', duration: '1h' },
    { time: isFastPaced ? '19:00' : '20:00', title: hasNightlife ? 'Dinner & Night Market' : 'Dinner', category: hasFood ? 'Food' : 'Meal', duration: '2h' },
  ]

  const day02Activities: Activity[] = [
    { time: isRelaxed ? '09:00' : '08:00', title: 'Breakfast', category: 'Meal', duration: '1h' },
    { time: isRelaxed ? '10:30' : '09:30', title: hasBeaches ? 'Beach Day or Water Activity' : 'Main Attraction', category: hasCulture ? 'Culture' : 'Leisure', duration: isFastPaced ? '2h' : '3h' },
    { time: isRelaxed ? '14:00' : '12:30', title: 'Lunch Break', category: 'Meal', duration: '1h' },
    { time: isRelaxed ? '15:30' : '14:00', title: hasCulture ? 'Cultural Site or Museum' : 'Local Experience', category: 'Culture', duration: '2h' },
    { time: isRelaxed ? '18:00' : '17:00', title: 'Sunset Experience', category: 'Leisure', duration: '1h' },
    { time: isRelaxed ? '19:30' : '19:00', title: hasNightlife ? 'Night Market or Nightlife' : 'Dinner', category: hasNightlife ? 'Nightlife' : 'Meal', duration: '2h' },
  ]

  const day03Activities: Activity[] = [
    { time: '09:00', title: 'Breakfast', category: 'Meal', duration: '1h' },
    { time: '10:30', title: hasFood ? 'Food Experience or Local Specialty' : 'Activity', category: 'Food', duration: '2h' },
    { time: '13:00', title: 'Lunch', category: 'Meal', duration: '1h' },
    { time: '14:30', title: hasCulture ? 'Cultural Experience or Heritage Walk' : 'Local Exploration', category: 'Culture', duration: isFastPaced ? '2h' : '3h' },
    { time: isFastPaced ? '17:00' : '18:00', title: hasNightlife ? 'Evening Entertainment' : 'Relaxation', category: 'Leisure', duration: '1h' },
    { time: isFastPaced ? '18:30' : '19:30', title: 'Dinner & Nightlife', category: hasNightlife ? 'Nightlife' : 'Meal', duration: '2h' },
  ]

  const day04Activities: Activity[] = [
    { time: '08:00', title: 'Breakfast', category: 'Meal', duration: '1h' },
    { time: '09:30', title: 'Hotel Checkout', category: 'Logistics', duration: '1h' },
    { time: '11:00', title: 'Final Lunch or Souvenir Shopping', category: 'Leisure', duration: '1h' },
    { time: '13:00', title: `Depart ${input.to}`, category: 'Transport', duration: '2h' },
  ]

  const allDayActivities = [day01Activities, day02Activities, day03Activities, day04Activities]
  const dayLabels = [
    `${input.from} → ${input.to}`,
    'Exploration & Beaches',
    'Culture & Nightlife',
    'Departure',
  ]

  const days: ItineraryDay[] = Array.from({ length: tripDays }, (_, i) => {
    const dayNum = i + 1
    const currentDate = new Date(departureDate)
    currentDate.setDate(currentDate.getDate() + i)
    const dateStr = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

    return {
      day: `DAY ${dayNum.toString().padStart(2, '0')}`,
      date: dateStr,
      label: dayLabels[i] || `Day ${dayNum}`,
      activities: allDayActivities[i] || [],
    }
  })

  return {
    id: `trip-${Date.now()}`,
    from: input.from || 'Mumbai',
    to: input.to || 'Goa',
    departureDate: input.departure || '2026-10-08',
    returnDate: input.returnDate || '2026-10-11',
    travelers: Math.max(1, Number(input.travelers) || 2),
    budget: normalizedBudget,
    interests: input.interests,
    travelStyle: input.style,
    generatedAt: new Date().toISOString(),
    days,
    metrics: {
      budgetUsed,
      routeEfficiency: Math.min(99, routeEfficiency),
      interestMatch: Math.min(99, interestMatch),
      weather: 'Partly cloudy',
    },
  }
}

export function buildTripSnapshot(input: {
  from: string
  to: string
  departure: string
  returnDate: string
  travelers: number
  budget: number
  interests: Interest[]
  style: TravelStyle
}) {
  const journey = generateJourney(input)
  return {
    from: journey.from,
    to: journey.to,
    departure: journey.departureDate,
    return: journey.returnDate,
    travelers: journey.travelers,
    budgetTotal: journey.budget,
    budgetUsed: journey.metrics.budgetUsed,
    routeEfficiency: journey.metrics.routeEfficiency,
    interestMatch: journey.metrics.interestMatch,
    weather: journey.metrics.weather,
    days: journey.days.map((d) => ({
      day: d.day,
      label: d.label,
      stops: d.activities.map((a) => ({ title: a.title })),
    })),
  }
}

export function getDestinationByName(name: string) {
  return DESTINATIONS.find((destination) => destination.name.toLowerCase() === String(name).toLowerCase()) ?? DESTINATIONS[0]
}

export function listSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(SAVED_TRIPS_KEY)
    return raw ? (JSON.parse(raw) as SavedTrip[]) : [
      {
        id: 'mumbai-goa-demo',
        title: 'Mumbai → Goa',
        route: 'Mumbai → Goa',
        dates: '08 Oct - 11 Oct',
        travelers: 2,
        budget: 30000,
        createdAt: new Date().toISOString(),
      },
    ]
  } catch {
    return []
  }
}

export function saveTrips(trips: SavedTrip[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
}
