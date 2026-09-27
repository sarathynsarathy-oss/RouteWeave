import type { RouteCoordinate } from './routing'

export const GOA_ROUTE_LOCATIONS: Record<string, RouteCoordinate> = {
  'Goa Hotel': { label: 'Goa Hotel', latitude: 15.4989, longitude: 73.8278 },
  'Baga Beach': { label: 'Baga Beach', latitude: 15.5557, longitude: 73.7517 },
  'Fort Aguada': { label: 'Fort Aguada', latitude: 15.492, longitude: 73.7739 },
  Sunset: { label: 'Sunset Point', latitude: 15.4767, longitude: 73.8078 },
  'Sunset Point': { label: 'Sunset Point', latitude: 15.4767, longitude: 73.8078 },
  'Night Market': { label: 'Dinner', latitude: 15.5267, longitude: 73.8271 },
  Dinner: { label: 'Dinner', latitude: 15.5267, longitude: 73.8271 },
  'Goa State Museum': { label: 'Goa State Museum', latitude: 15.4989, longitude: 73.8278 },
  'Local Food Experience': { label: 'Local Food Experience', latitude: 15.501, longitude: 73.83 },
  'Indoor Cultural Experience': { label: 'Indoor Cultural Experience', latitude: 15.489, longitude: 73.827 },
}

export function getActivityLocation(title: string) {
  return GOA_ROUTE_LOCATIONS[title]
}