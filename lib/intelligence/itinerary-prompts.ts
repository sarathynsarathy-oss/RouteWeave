import type { ItineraryInput } from './itinerary-types'

export function buildItineraryPrompt(input: ItineraryInput) {
  return [
    'Return one valid JSON object only. No markdown, explanation, or extra text.',
    'Schema: {"tripTitle":"string","summary":"string","days":[{"day":1,"date":"YYYY-MM-DD","theme":"string","activities":[{"id":"string","name":"string","type":"interest","location":"string","durationMinutes":90,"estimatedCost":1000,"indoor":true}],"estimatedDailyCost":2000}],"totalEstimatedCost":2000,"interestMatch":90,"reasoning":"string"}',
    `Trip ${input.from} to ${input.to}; ${input.departure} to ${input.returnDate}; ${input.travelers} travelers; total budget INR ${input.budget}; style ${input.style}.`,
    `Preserve these interests: ${input.interests.join(', ')}. Weather: ${input.weather.description}, severity ${input.weather.severity}, rain probability ${input.weather.precipitationProbability}%.`,
    'Maximum 4 days and 4 activities per day. Use short names, themes, summary, and reasoning. Keep activities affordable and geographically close; use indoor activities for severe weather. Activity costs are INR per traveler; daily and total costs cover all travelers and must stay within budget. Use only the requested schema and no coordinates.',
  ].join('\n')
}