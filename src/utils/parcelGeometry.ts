export interface LatLngPoint {
  lat: number
  lng: number
}

export interface PolygonBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export interface ResolvedParcelGeometry {
  center: LatLngPoint | null
  polygon: LatLngPoint[]
  source: string
}

const DEFAULT_FALLBACK_RADIUS_METERS = 650

function normalizePoint(point: any): LatLngPoint | null {
  if (!point) {
    return null
  }

  if (Array.isArray(point) && point.length >= 2) {
    const [lng, lat] = point
    const parsedLat = Number(lat)
    const parsedLng = Number(lng)

    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
      return { lat: parsedLat, lng: parsedLng }
    }

    return null
  }

  if (typeof point === 'object') {
    const parsedLat = Number(point.lat ?? point.latitude)
    const parsedLng = Number(point.lng ?? point.lon ?? point.longitude)

    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
      return { lat: parsedLat, lng: parsedLng }
    }
  }

  if (typeof point === 'string') {
    const parts = point.split(',').map((item) => Number(item.trim()))

    if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return { lng: parts[0], lat: parts[1] }
    }
  }

  return null
}

function closeRing(points: LatLngPoint[]): LatLngPoint[] {
  if (points.length === 0) {
    return points
  }

  const first = points[0]
  const last = points[points.length - 1]

  if (first.lat === last.lat && first.lng === last.lng) {
    return points
  }

  return [...points, first]
}

export function parseParcelPolygon(parcel: any): LatLngPoint[] {
  const sourceCandidates = [
    parcel?.polygonCoordinates,
    parcel?.boundaryCoordinates,
    parcel?.coordinates,
    parcel?.geometry?.coordinates?.[0],
    parcel?.geometry?.coordinates,
    parcel?.kmlCoordinates,
  ]

  for (const candidate of sourceCandidates) {
    if (!candidate) {
      continue
    }

    if (Array.isArray(candidate)) {
      const parsed = candidate.map(normalizePoint).filter((p): p is LatLngPoint => p !== null)

      if (parsed.length >= 3) {
        return closeRing(parsed)
      }
      continue
    }

    if (typeof candidate === 'string') {
      const parsed = candidate
        .trim()
        .split(/\s+/)
        .map((pair) => normalizePoint(pair))
        .filter((p): p is LatLngPoint => p !== null)

      if (parsed.length >= 3) {
        return closeRing(parsed)
      }
    }
  }

  return []
}

export function createFallbackPolygon(
  center: LatLngPoint | null,
  vertexCount = 10,
  radiusMeters = DEFAULT_FALLBACK_RADIUS_METERS
): LatLngPoint[] {
  if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) {
    return []
  }

  const latitudeRadians = (center.lat * Math.PI) / 180
  const latitudeDelta = radiusMeters / 111320
  const longitudeDelta = radiusMeters / (111320 * Math.max(Math.cos(latitudeRadians), 0.2))

  const points: LatLngPoint[] = []

  for (let index = 0; index < vertexCount; index += 1) {
    const angle = (Math.PI * 2 * index) / vertexCount
    const distanceScale = 0.68 + 0.32 * Math.sin(angle * 3)

    points.push({
      lat: center.lat + Math.sin(angle) * latitudeDelta * distanceScale,
      lng: center.lng + Math.cos(angle) * longitudeDelta * distanceScale,
    })
  }

  return closeRing(points)
}

export function resolveParcelGeometry(parcel: any): ResolvedParcelGeometry {
  const center = normalizePoint({ lat: parcel?.lat, lng: parcel?.lng })
  const polygon = parseParcelPolygon(parcel)

  if (polygon.length > 0) {
    return {
      center,
      polygon,
      source: 'Uploaded parcel polygon',
    }
  }

  return {
    center,
    polygon: createFallbackPolygon(center),
    source: 'Generated preview polygon',
  }
}

export function getPolygonBounds(points: LatLngPoint[]): PolygonBounds | null {
  if (!points || points.length === 0) {
    return null
  }

  return points.reduce(
    (bounds, point) => ({
      minLat: Math.min(bounds.minLat, point.lat),
      maxLat: Math.max(bounds.maxLat, point.lat),
      minLng: Math.min(bounds.minLng, point.lng),
      maxLng: Math.max(bounds.maxLng, point.lng),
    }),
    {
      minLat: points[0].lat,
      maxLat: points[0].lat,
      minLng: points[0].lng,
      maxLng: points[0].lng,
    }
  )
}

export function projectPoint(
  point: LatLngPoint,
  bounds: PolygonBounds,
  width = 1000,
  height = 700,
  padding = 56
): { x: number; y: number } {
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.0001)
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.0001)

  return {
    x: padding + ((point.lng - bounds.minLng) / lngSpan) * (width - padding * 2),
    y: height - padding - ((point.lat - bounds.minLat) / latSpan) * (height - padding * 2),
  }
}

export function buildGeoJsonFeature(parcel: any, polygon: LatLngPoint[]) {
  return {
    type: 'Feature',
    properties: {
      parcelId: parcel?.id ?? '',
      location: parcel?.location ?? '',
      state: parcel?.state ?? '',
      area: parcel?.area ?? '',
      source: 'GCP polygon preview',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [polygon.map((point) => [point.lng, point.lat])],
    },
  }
}

export function buildKmlDocument(parcel: any, polygon: LatLngPoint[]) {
  const coordinates = polygon.map((point) => `${point.lng},${point.lat},0`).join(' ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${parcel?.id ?? 'parcel-preview'}</name>
    <Placemark>
      <name>${parcel?.location ?? parcel?.id ?? 'Parcel boundary'}</name>
      <description>${parcel?.state ?? ''}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`
}
