export type DestinationCoordinates = {
  name: string
  latitude: number
  longitude: number
}

type GeocodingResponse = {
  results?: Array<{ name?: string; latitude?: number; longitude?: number; country_code?: string }>
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const REQUEST_TIMEOUT_MS = 7000

const KNOWN_DESTINATIONS: Record<string, DestinationCoordinates> = {
  chennai: { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  kodaikanal: { name: 'Kodaikanal', latitude: 10.2381, longitude: 77.4892 },
  mumbai: { name: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  goa: { name: 'Goa', latitude: 15.4909, longitude: 73.8278 },
  panaji: { name: 'Panaji', latitude: 15.4909, longitude: 73.8278 },
  jaipur: { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873 },
  manali: { name: 'Manali', latitude: 32.2396, longitude: 77.1887 },
  munnar: { name: 'Munnar', latitude: 10.0889, longitude: 77.0595 },
  varanasi: { name: 'Varanasi', latitude: 25.3176, longitude: 82.9739 },
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().split(',')[0].replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ')
}

export function getKnownDestinationCoordinates(destination: string): DestinationCoordinates | undefined {
  return KNOWN_DESTINATIONS[normalizeName(destination)]
}

export async function resolveDestinationCoordinates(destination: string): Promise<DestinationCoordinates> {
  const known = getKnownDestinationCoordinates(destination)
  if (known) return known

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const params = new URLSearchParams({ name: destination, count: '10', language: 'en', format: 'json' })
    const response = await fetch(`${GEOCODING_URL}?${params.toString()}`, { signal: controller.signal })
    if (!response.ok) throw new Error(`Geocoding failed with ${response.status}`)
    const data = (await response.json()) as GeocodingResponse
    const normalizedDestination = normalizeName(destination)
    const candidates = data.results?.filter((candidate) =>
      typeof candidate.latitude === 'number' && Number.isFinite(candidate.latitude) &&
      typeof candidate.longitude === 'number' && Number.isFinite(candidate.longitude),
    ) || []
    const result = candidates.find((candidate) => normalizeName(candidate.name || '') === normalizedDestination && candidate.country_code === 'IN') ||
      candidates.find((candidate) => normalizeName(candidate.name || '') === normalizedDestination) ||
      candidates.find((candidate) => candidate.country_code === 'IN') || candidates[0]
    if (!result || typeof result.latitude !== 'number' || typeof result.longitude !== 'number') {
      throw new Error('Destination not found')
    }
    return { name: result.name || destination, latitude: result.latitude, longitude: result.longitude }
  } finally {
    window.clearTimeout(timeout)
  }
}
