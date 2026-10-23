'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { companies } from '../data/companies'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const stateCoords: Record<string, [number, number]> = {
  Maharashtra: [19.7515, 75.7139],
  Gujarat: [22.2587, 71.1924],
  Karnataka: [15.3173, 75.7139],
  'Madhya Pradesh': [22.9734, 78.6569],
  Chhattisgarh: [21.2787, 81.8661],
  'West Bengal': [22.9868, 87.855],
  Odisha: [20.9517, 85.0985],
  Rajasthan: [27.0238, 74.2179],
  default: [20.5937, 78.9629],
}

function jitter(coord: [number, number], index: number): [number, number] {
  const seed = ((index * 0.1) % 0.8) - 0.4
  return [coord[0] + seed, coord[1] + seed * 1.5]
}

interface IndiaMonitoringMapProps {
  onParcelClick?: (parcel: any) => void
}

export default function IndiaMonitoringMap({ onParcelClick }: IndiaMonitoringMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const parcels: any[] = []

  // Aggregate all parcels
  companies.forEach((company) => {
    company.allocatedParcels.forEach((parcel) => {
      parcels.push({
        ...parcel,
        company: company.name,
        companyCredits: company.credits.earned,
        status: 'Active',
      })
    })
    company.pendingParcels.forEach((parcel) => {
      parcels.push({
        ...parcel,
        company: company.name,
        companyCredits: company.credits.earned,
        status: 'Pending',
      })
    })
  })

  const getParcelColor = (p: any) => {
    if (p.status === 'Pending') return '#f59e0b'
    if (p.state === 'Maharashtra' && p.area < 25) return '#dc2626'
    return '#16a34a'
  }

  return (
    <Box sx={{ height: 450, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid #d6d3d1' }}>
      {mounted && (
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.5}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {parcels.map((p, i) => {
            const baseCoord = stateCoords[p.state] || stateCoords.default
            const finalCoord = jitter(baseCoord, i)
            const color = getParcelColor(p)

            return (
              <CircleMarker
                key={p.id}
                center={finalCoord}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.8,
                  weight: 2,
                }}
                radius={8}
              >
                <Popup>
                  <Box sx={{ minWidth: 200, p: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1c1917', mb: 0.5 }}>
                      {p.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#57534e', fontSize: '0.8rem', mb: 1 }}>
                      {p.company}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>State:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.state}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>Area:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.area} ha</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" mb={1.5}>
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>Status:</Typography>
                      <Chip
                        label={p.status === 'Active' && color === '#dc2626' ? 'Flagged' : p.status}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          bgcolor: color + '20',
                          color: color,
                        }}
                      />
                    </Stack>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      color="success"
                      sx={{ fontSize: '0.7rem' }}
                      onClick={() => onParcelClick && onParcelClick(p)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      )}
    </Box>
  )
}
