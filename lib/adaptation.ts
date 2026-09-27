import type { Activity, ItineraryDay, JourneyTrip } from './mock-trip'
import type { DisruptionSeverity, NormalizedWeather } from './weather'

export type ActivityCategory = 'OUTDOOR' | 'INDOOR' | 'FOOD' | 'CULTURE' | 'NIGHTLIFE' | 'SHOPPING' | 'RELAXATION'

export type EvaluatedActivity = Activity & { category: ActivityCategory; affected: boolean }

export type AdaptationResult = {
  disruptionDetected: boolean
  disruptionType: 'weather'
  severity: Lowercase<DisruptionSeverity>
  affectedActivities: string[]
  replacementActivities: string[]
  reasons: string[]
  budgetImpact: number
  interestsPreserved: boolean
}

const replacements = [
  { title: 'Goa State Museum', category: 'CULTURE' as const, interest: 'CULTURE' as const },
  { title: 'Local Food Experience', category: 'FOOD' as const, interest: 'FOOD' as const },
  { title: 'Indoor Cultural Experience', category: 'CULTURE' as const, interest: 'CULTURE' as const },
  { title: 'Dinner', category: 'FOOD' as const, interest: 'FOOD' as const },
]

function categorize(activity: Activity): ActivityCategory {
  const text = `${activity.title} ${activity.category || ''}`.toLowerCase()
  if (/beach|fort|sunset|water|outdoor|stroll|explor/.test(text)) return 'OUTDOOR'
  if (/museum|culture|indoor|heritage/.test(text)) return 'CULTURE'
  if (/food|lunch|dinner|breakfast|meal/.test(text)) return 'FOOD'
  if (/night|market|club/.test(text)) return 'NIGHTLIFE'
  if (/shop|souvenir/.test(text)) return 'SHOPPING'
  if (/relax|spa/.test(text)) return 'RELAXATION'
  return 'INDOOR'
}

export function evaluateWeatherDisruption(weather: NormalizedWeather, itinerary: ItineraryDay): EvaluatedActivity[] {
  return itinerary.activities.map((activity) => {
    const category = categorize(activity)
    return { ...activity, category, affected: weather.isOutdoorDisruption && category === 'OUTDOOR' }
  })
}

export function adaptTrip(trip: JourneyTrip, weather: NormalizedWeather, itinerary: ItineraryDay): AdaptationResult {
  const evaluated = evaluateWeatherDisruption(weather, itinerary)
  const affectedActivities = evaluated.filter((activity) => activity.affected).map((activity) => activity.title)
  const disruptionDetected = affectedActivities.length > 0 && weather.severity !== 'NONE'
  const ranked = replacements
    .map((candidate) => ({
      ...candidate,
      score:
        (trip.interests.includes(candidate.interest) ? 4 : 0) +
        (candidate.category === 'CULTURE' || candidate.category === 'FOOD' ? 3 : 0) +
        (trip.travelStyle === 'RELAXED' ? 1 : 0),
    }))
    .sort((left, right) => right.score - left.score)

  return {
    disruptionDetected,
    disruptionType: 'weather',
    severity: weather.severity.toLowerCase() as Lowercase<DisruptionSeverity>,
    affectedActivities,
    replacementActivities: disruptionDetected ? ranked.slice(0, Math.max(affectedActivities.length, 4)).map((activity) => activity.title) : [],
    reasons: disruptionDetected
      ? [`${weather.description} affects outdoor activities`, 'Indoor alternatives preserve interests and budget']
      : ['No weather disruption detected'],
    budgetImpact: 0,
    interestsPreserved: !disruptionDetected || ranked.some((activity) => trip.interests.includes(activity.interest)),
  }
}