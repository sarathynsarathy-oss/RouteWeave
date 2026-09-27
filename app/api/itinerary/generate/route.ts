import { NextResponse } from 'next/server'
import { documentToJourney, generateDeterministicItinerary } from '@/lib/intelligence/itinerary-engine'
import type { ItineraryInput } from '@/lib/intelligence/itinerary-types'
import { generateWithConfiguredProvider, OPENROUTER_MODEL } from '@/lib/intelligence/ai-provider'

function isValidInput(value: unknown): value is ItineraryInput {
  if (!value || typeof value !== 'object') return false
  const input = value as Partial<ItineraryInput>
  return Boolean(
    typeof input.from === 'string' && typeof input.to === 'string' &&
    typeof input.departure === 'string' && typeof input.returnDate === 'string' &&
    Number.isFinite(input.travelers) && Number.isFinite(input.budget) &&
    Array.isArray(input.interests) && typeof input.style === 'string' && input.weather,
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown
    if (!isValidInput(body)) return NextResponse.json({ error: 'Invalid itinerary input' }, { status: 400 })
    const input = body as ItineraryInput
    const fallback = generateDeterministicItinerary(input)
    const model = process.env.AI_PROVIDER === 'openrouter'
      ? OPENROUTER_MODEL
      : process.env.AI_PROVIDER === 'gemini'
        ? process.env.GEMINI_MODEL || 'gemini-2.0-flash'
        : null

    try {
      const aiDocument = await generateWithConfiguredProvider(input)
      if (aiDocument && aiDocument.totalEstimatedCost <= input.budget) {
        const journey = documentToJourney(input, aiDocument)
        journey.intelligence = { source: 'ai', status: 'AI itinerary ready' }
        console.info(`Itinerary generation outcome ${JSON.stringify({ model, source: 'ai', fallbackUsed: false })}`)
        return NextResponse.json({ journey, document: aiDocument, source: 'ai', status: 'AI itinerary ready' })
      }
    } catch {
      // Provider failures deliberately fall through to deterministic intelligence.
    }

    fallback.journey.intelligence = { source: 'fallback', status: 'Using RouteWeave fallback intelligence' }
  console.info(`Itinerary generation outcome ${JSON.stringify({ model, source: 'fallback', fallbackUsed: true })}`)
    return NextResponse.json({ journey: fallback.journey, document: fallback.document, source: 'fallback', status: 'Using RouteWeave fallback intelligence' })
  } catch {
    return NextResponse.json({ error: 'Unable to generate itinerary' }, { status: 500 })
  }
}