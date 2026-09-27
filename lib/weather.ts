export type WeatherClassification = 'CLEAR' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'RAIN' | 'HEAVY_RAIN' | 'THUNDERSTORM'
export type DisruptionSeverity = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'

export type DestinationCoordinates = {
  name: string
  latitude: number
  longitude: number
}

export type NormalizedWeather = {
  destination: string
  latitude: number
  longitude: number
  temperature: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
  description: string
  classification: WeatherClassification
  severity: DisruptionSeverity
  isOutdoorDisruption: boolean
  isFallback?: boolean
}

type GeocodingResponse = {
  results?: Array<{ name?: string; latitude?: number; longitude?: number }>
}

type ForecastResponse = {
  current?: { temperature_2m?: number; precipitation?: number; weather_code?: number }
  hourly?: { precipitation_probability?: number[] }
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const WEATHER_CACHE_KEY = 'routeweave.weather.v2'
const REQUEST_TIMEOUT_MS = 7000

export const demoHeavyRainWeather: NormalizedWeather = {
  destination: 'Goa',
  latitude: 15.49,
  longitude: 73.82,
  temperature: 29,
  precipitationProbability: 80,
  precipitation: 12,
  weatherCode: 63,
  description: 'Heavy rain',
  classification: 'HEAVY_RAIN',
  severity: 'HIGH',
  isOutdoorDisruption: true,
  isFallback: true,
}

function withTimeout<T>(request: Promise<T>) {
  return Promise.race([
    request,
    new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Weather request timed out')), REQUEST_TIMEOUT_MS)),
  ])
}

function validNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function classifyWeather(weatherCode: number, precipitation: number, precipitationProbability = 0): WeatherClassification {
  if (weatherCode >= 95 && weatherCode <= 99) return 'THUNDERSTORM'
  if (weatherCode >= 65 || precipitation >= 7 || precipitationProbability >= 80) return 'HEAVY_RAIN'
  if (weatherCode >= 51 || precipitation > 0 || precipitationProbability >= 40) return 'RAIN'
  if (weatherCode === 1 || weatherCode === 2) return 'PARTLY_CLOUDY'
  if (weatherCode === 3) return 'CLOUDY'
  return 'CLEAR'
}

export function getDisruptionSeverity(classification: WeatherClassification, precipitation: number): DisruptionSeverity {
  if (classification === 'THUNDERSTORM' || classification === 'HEAVY_RAIN' || precipitation >= 7) return 'HIGH'
  if (classification === 'RAIN') return precipitation >= 3 ? 'MEDIUM' : 'LOW'
  if (classification === 'CLOUDY') return 'LOW'
  return 'NONE'
}

function describeWeather(classification: WeatherClassification) {
  return classification.replace('_', ' ').toLowerCase().replace(/^./, (letter) => letter.toUpperCase())
}

export async function getCoordinates(destination: string): Promise<DestinationCoordinates> {
  const response = await withTimeout(fetch(`${GEOCODING_URL}?name=${encodeURIComponent(destination)}&count=10&language=en&format=json`))
  if (!response.ok) throw new Error(`Geocoding failed with ${response.status}`)
  const data = (await response.json()) as GeocodingResponse
  const normalizedDestination = destination.trim().toLowerCase()
  const result = data.results?.find((candidate) => candidate.name?.trim().toLowerCase() === normalizedDestination) || data.results?.[0]
  if (!result || !validNumber(result.latitude) || !validNumber(result.longitude)) throw new Error('Destination not found')
  return { name: result.name || destination, latitude: result.latitude, longitude: result.longitude }
}

export async function getWeather(latitude: number, longitude: number, destination: string): Promise<NormalizedWeather> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,precipitation,weather_code',
    hourly: 'precipitation_probability',
    forecast_days: '1',
    timezone: 'auto',
  })
  const response = await withTimeout(fetch(`${FORECAST_URL}?${params.toString()}`))
  if (!response.ok) throw new Error(`Forecast failed with ${response.status}`)
  const data = (await response.json()) as ForecastResponse
  const temperature = data.current?.temperature_2m
  const precipitation = data.current?.precipitation
  const weatherCode = data.current?.weather_code
  const precipitationProbability = data.hourly?.precipitation_probability?.[0] ?? 0
  if (!validNumber(temperature) || !validNumber(precipitation) || !validNumber(weatherCode)) throw new Error('Malformed forecast response')
  const classification = classifyWeather(weatherCode, precipitation, precipitationProbability)
  return {
    destination,
    latitude,
    longitude,
    temperature: Math.round(temperature),
    precipitationProbability,
    precipitation,
    weatherCode,
    description: describeWeather(classification),
    classification,
    severity: getDisruptionSeverity(classification, precipitation),
    isOutdoorDisruption: classification === 'RAIN' || classification === 'HEAVY_RAIN' || classification === 'THUNDERSTORM',
  }
}

export async function getDestinationWeather(destination: string): Promise<NormalizedWeather> {
  const key = destination.trim().toLowerCase()
  if (!key) return { ...demoHeavyRainWeather }
  try {
    const cached = sessionStorage.getItem(`${WEATHER_CACHE_KEY}:${key}`)
    if (cached) return JSON.parse(cached) as NormalizedWeather
  } catch {
    // Storage is optional; a network request can still provide live weather.
  }

  try {
    const coordinates = await getCoordinates(destination)
    const weather = await getWeather(coordinates.latitude, coordinates.longitude, destination)
    try {
      sessionStorage.setItem(`${WEATHER_CACHE_KEY}:${key}`, JSON.stringify(weather))
    } catch {
      // Ignore storage quota and privacy-mode failures.
    }
    return weather
  } catch {
    return { ...demoHeavyRainWeather, destination }
  }
}