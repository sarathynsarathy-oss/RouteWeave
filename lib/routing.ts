import { resolveDestinationCoordinates } from './destinations'

export type RouteCoordinate = {
  latitude: number
  longitude: number
  label?: string
}

export type RouteLeg = {
  from: string
  to: string
  distanceKm: number
  durationMinutes: number
}

export type RouteResult = {
  distanceKm: number
  durationMinutes: number
  geometry: Array<[number, number]>
  coordinates: RouteCoordinate[]
  legs: RouteLeg[]
  isFallback?: boolean
}

type OsrmResponse = {
  code?: string
  routes?: Array<{
    distance?: number
    duration?: number
    geometry?: { coordinates?: Array<[number, number]> }
    legs?: Array<{ distance?: number; duration?: number }>
  }>
}

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving/'
const ROUTE_CACHE_KEY = 'routeweave.route.v1'
const REQUEST_TIMEOUT_MS = 8000

function validCoordinate(coordinate: RouteCoordinate) {
  return Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude) &&
    Math.abs(coordinate.latitude) <= 90 && Math.abs(coordinate.longitude) <= 180
}

function coordinateKey(coordinate: RouteCoordinate) {
  return `${coordinate.longitude.toFixed(5)},${coordinate.latitude.toFixed(5)}`
}

function cacheKey(coordinates: RouteCoordinate[]) {
  return `${ROUTE_CACHE_KEY}:${coordinates.map(coordinateKey).join(';')}`
}

function normalizeRoute(data: OsrmResponse, coordinates: RouteCoordinate[]): RouteResult {
  const route = data.routes?.[0]
  if (data.code !== 'Ok' || !route || typeof route.distance !== 'number' || !Number.isFinite(route.distance) || typeof route.duration !== 'number' || !Number.isFinite(route.duration)) {
    throw new Error('OSRM did not return a route')
  }
  const legs = route.legs || []
  return {
    distanceKm: Math.round((route.distance / 1000) * 10) / 10,
    durationMinutes: Math.round(route.duration / 60),
    geometry: route.geometry?.coordinates || [],
    coordinates,
    legs: legs.map((leg, index) => ({
      from: coordinates[index]?.label || `Stop ${index + 1}`,
      to: coordinates[index + 1]?.label || `Stop ${index + 2}`,
      distanceKm: Math.round(((leg.distance || 0) / 1000) * 10) / 10,
      durationMinutes: Math.round((leg.duration || 0) / 60),
    })),
  }
}

export async function getRoute(origin: RouteCoordinate, destination: RouteCoordinate): Promise<RouteResult> {
  return getMultiStopRoute([origin, destination])
}

function distanceBetween(origin: RouteCoordinate, destination: RouteCoordinate) {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const latitudeDelta = radians(destination.latitude - origin.latitude)
  const longitudeDelta = radians(destination.longitude - origin.longitude)
  const originLatitude = radians(origin.latitude)
  const destinationLatitude = radians(destination.latitude)
  const haversine = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export function getDeterministicRoute(coordinates: RouteCoordinate[]): RouteResult {
  if (coordinates.length < 2 || coordinates.some((coordinate) => !validCoordinate(coordinate))) {
    throw new Error('At least two valid route coordinates are required')
  }
  const legs = coordinates.slice(1).map((destination, index) => {
    const origin = coordinates[index]
    const distanceKm = Math.round(distanceBetween(origin, destination) * 1.2 * 10) / 10
    return {
      from: origin.label || `Stop ${index + 1}`,
      to: destination.label || `Stop ${index + 2}`,
      distanceKm,
      durationMinutes: Math.round(distanceKm / 55 * 60),
    }
  })
  return {
    distanceKm: Math.round(legs.reduce((total, leg) => total + leg.distanceKm, 0) * 10) / 10,
    durationMinutes: legs.reduce((total, leg) => total + leg.durationMinutes, 0),
    geometry: coordinates.map(({ latitude, longitude }) => [longitude, latitude]),
    coordinates,
    legs,
    isFallback: true,
  }
}

export async function getRouteWithFallback(coordinates: RouteCoordinate[]): Promise<RouteResult> {
  try {
    return await getMultiStopRoute(coordinates)
  } catch {
    return getDeterministicRoute(coordinates)
  }
}

export async function getRouteBetweenPlaces(origin: string, destination: string): Promise<RouteResult> {
  const [originCoordinates, destinationCoordinates] = await Promise.all([
    resolveDestinationCoordinates(origin),
    resolveDestinationCoordinates(destination),
  ])
  return getRouteWithFallback([
    { label: origin, latitude: originCoordinates.latitude, longitude: originCoordinates.longitude },
    { label: destination, latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude },
  ])
}

export async function getMultiStopRoute(coordinates: RouteCoordinate[]): Promise<RouteResult> {
  if (coordinates.length < 2 || coordinates.some((coordinate) => !validCoordinate(coordinate))) {
    throw new Error('At least two valid route coordinates are required')
  }
  const key = cacheKey(coordinates)
  try {
    const cached = sessionStorage.getItem(key)
    if (cached) return JSON.parse(cached) as RouteResult
  } catch {
    // Routing remains available when session storage is disabled.
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const coordinatePath = coordinates.map((coordinate) => `${coordinate.longitude},${coordinate.latitude}`).join(';')
    const response = await fetch(`${OSRM_URL}${coordinatePath}?overview=full&geometries=geojson&steps=false`, { signal: controller.signal })
    if (!response.ok) throw new Error(`OSRM request failed with ${response.status}`)
    const result = normalizeRoute((await response.json()) as OsrmResponse, coordinates)
    try {
      sessionStorage.setItem(key, JSON.stringify(result))
    } catch {
      // Ignore storage quota and privacy-mode failures.
    }
    return result
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function getOptimizedRoute(locations: RouteCoordinate[]): Promise<RouteResult> {
  if (locations.length < 2) throw new Error('At least two locations are required')
  const [origin, ...remaining] = locations
  const destination = remaining.pop() as RouteCoordinate
  const ordered = [origin]
  let current = origin
  while (remaining.length) {
    const nextIndex = remaining.reduce((bestIndex, candidate, index) => {
      const best = remaining[bestIndex]
      const bestDistance = Math.hypot(best.latitude - current.latitude, best.longitude - current.longitude)
      const candidateDistance = Math.hypot(candidate.latitude - current.latitude, candidate.longitude - current.longitude)
      return candidateDistance < bestDistance ? index : bestIndex
    }, 0)
    current = remaining.splice(nextIndex, 1)[0]
    ordered.push(current)
  }
  ordered.push(destination)
  return getMultiStopRoute(ordered)
}

export async function getOptimizedRouteWithFallback(locations: RouteCoordinate[]): Promise<RouteResult> {
  try {
    return await getOptimizedRoute(locations)
  } catch {
    return getDeterministicRoute(locations)
  }
}

export function calculateRouteEfficiency(current: RouteResult, optimized: RouteResult): number {
  if (current.distanceKm <= 0) return 100
  return Math.max(1, Math.min(100, Math.round((optimized.distanceKm / current.distanceKm) * 100)))
}