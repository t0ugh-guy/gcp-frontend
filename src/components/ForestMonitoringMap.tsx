'use client'

import React, { useEffect, useState } from 'react'
import { Box, Slider, Stack, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
)

const getPolygon = (center: [number, number]): [number, number][] => [
  [center[0] + 0.005, center[1] - 0.005],
  [center[0] + 0.005, center[1] + 0.006],
  [center[0] - 0.004, center[1] + 0.005],
  [center[0] - 0.006, center[1] - 0.004],
]

const marks = [
  { value: 0, label: 'Start' },
  { value: 25, label: '3M' },
  { value: 50, label: '6M' },
  { value: 75, label: '12M' },
  { value: 100, label: 'Present' },
]

interface ForestMonitoringMapProps {
  parcelId?: string
}

export default function ForestMonitoringMap({ parcelId }: ForestMonitoringMapProps) {
  const [progress, setProgress] = useState(100)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const center: [number, number] = [22.44, 76.54]
  const parcelPolygon = getPolygon(center)

  const getPolygonColor = (prog: number) => {
    if (prog < 20) return '#92400e'
    if (prog < 40) return '#d9f99d'
    if (prog < 60) return '#84cc16'
    if (prog < 80) return '#16a34a'
    return '#14532d'
  }

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setProgress(newValue as number)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          height: 350,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #d6d3d1',
          mb: 2,
          position: 'relative',
        }}
      >
        {mounted && (
          <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <Polygon
              positions={parcelPolygon}
              pathOptions={{
                color: '#fbbf24',
                weight: 2,
                fillColor: getPolygonColor(progress),
                fillOpacity: 0.65,
              }}
            />
          </MapContainer>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: '#14532d', letterSpacing: 0.5 }}
          >
            {parcelId ? `PARCEL: ${parcelId}` : 'SATELLITE VIEW'}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: '#f0fdf4',
          borderRadius: 3,
          border: '1px solid #bbf7d0',
        }}
      >
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: '#166534', lineHeight: 1 }}
        >
          Restoration Timeline Simulation
        </Typography>
        <Stack direction="row" alignItems="center" spacing={3} mt={1}>
          <Slider
            value={progress}
            onChange={handleSliderChange}
            step={null}
            marks={marks}
            sx={{
              color: '#16a34a',
              '& .MuiSlider-markLabel': {
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#14532d',
              },
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}
