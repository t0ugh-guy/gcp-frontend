'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import {
  buildGeoJsonFeature,
  buildKmlDocument,
  resolveParcelGeometry,
} from '../utils/parcelGeometry'

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
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const LayersControl: any = dynamic(
  () => import('react-leaflet').then((mod) => mod.LayersControl),
  { ssr: false }
)

function downloadTextFile(content: string, fileName: string, mimeType: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

interface ParcelMapDialogProps {
  open: boolean
  parcel: any
  onClose: () => void
}

export default function ParcelMapDialog({ open, parcel, onClose }: ParcelMapDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fix default marker icon issues with React Leaflet
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
        const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        const DefaultIcon = L.icon({
          iconUrl: icon,
          shadowUrl: iconShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
        L.Marker.prototype.options.icon = DefaultIcon
      })
    }
  }, [])

  const geometry = useMemo(() => resolveParcelGeometry(parcel), [parcel])

  const polygonPositions = useMemo(() => {
    if (!geometry.polygon || geometry.polygon.length === 0) return []
    return geometry.polygon.map((p) => [p.lat, p.lng] as [number, number])
  }, [geometry.polygon])

  const handleDownload = (format: 'geojson' | 'kml') => {
    if (!parcel || geometry.polygon.length === 0) {
      return
    }

    if (format === 'geojson') {
      downloadTextFile(
        `${JSON.stringify(buildGeoJsonFeature(parcel, geometry.polygon), null, 2)}\n`,
        `${parcel.id}.geojson`,
        'application/geo+json'
      )
      return
    }

    downloadTextFile(
      buildKmlDocument(parcel, geometry.polygon),
      `${parcel.id}.kml`,
      'application/vnd.google-earth.kml+xml'
    )
  }

  const openGoogleMaps = () => {
    if (!parcel?.lat || !parcel?.lng) {
      return
    }

    window.open(
      `https://www.google.com/maps?q=${parcel.lat},${parcel.lng}&z=14`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const centerLabel =
    parcel?.lat && parcel?.lng
      ? `${Number(parcel.lat).toFixed(5)}, ${Number(parcel.lng).toFixed(5)}`
      : 'No center coordinate'
  const centerPos: [number, number] =
    parcel?.lat && parcel?.lng
      ? [parcel.lat, parcel.lng]
      : polygonPositions.length > 0
      ? polygonPositions[0]
      : [20.0, 79.0]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceOutlined sx={{ color: '#14532d' }} />
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                {parcel?.id ?? 'Parcel map preview'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {parcel?.location ?? 'Boundary preview from parcel coordinates'}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={geometry.source}
            size="small"
            color={geometry.source === 'Uploaded parcel polygon' ? 'success' : 'warning'}
            variant="outlined"
          />
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2}>
          <Alert severity="info" sx={{ mt: 1 }}>
            The map shows the true parcel polygon based on real site JSON/KML coordinates.
          </Alert>

          <Box
            sx={{
              position: 'relative',
              height: { xs: 420, md: 520 },
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #cde7d3',
              zIndex: 0,
            }}
          >
            {open && mounted && (
              <MapContainer
                center={centerPos}
                zoom={15}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <LayersControl position="topleft">
                  <LayersControl.BaseLayer name="Map">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer checked name="Satellite">
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {polygonPositions.length > 0 && (
                  <Polygon
                    positions={polygonPositions}
                    pathOptions={{
                      color: '#ff0000',
                      fillColor: '#ff0000',
                      fillOpacity: 0.1,
                      weight: 3,
                    }}
                  />
                )}
                {geometry.center && (
                  <Marker position={[geometry.center.lat, geometry.center.lng]} />
                )}
              </MapContainer>
            )}

            <Box
              sx={{
                position: 'absolute',
                left: 16,
                bottom: 24,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                zIndex: 1000,
              }}
            >
              <Chip
                label={`Area: ${parcel?.area ?? 'N/A'} ha`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 600 }}
              />
              <Chip
                label={parcel?.state ?? 'State unavailable'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 600 }}
              />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                right: 16,
                bottom: 24,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(10, 25, 15, 0.85)',
                color: '#fff',
                minWidth: 220,
                zIndex: 1000,
                boxShadow: 3,
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                Center coordinate
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                {centerLabel}
              </Typography>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.12)' }} />
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                Polygon vertices
              </Typography>
              <Typography variant="body2">{Math.max(geometry.polygon.length - 1, 0)}</Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid #dbe7dc', bgcolor: '#fff' }}>
              <Typography variant="caption" color="text.secondary">
                Parcel summary
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.5, color: '#14532d' }}>
                {parcel?.location ?? 'Location unavailable'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Parcel ID: {parcel?.id ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid #dbe7dc', bgcolor: '#fff' }}>
              <Typography variant="caption" color="text.secondary">
                Export format
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.5, color: '#14532d' }}>
                GeoJSON or KML
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download the real site tracking JSON/KML coordinates.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose}>Close</Button>
        <Button startIcon={<OpenInNewOutlined />} onClick={openGoogleMaps} variant="outlined">
          Google Maps
        </Button>
        <Button startIcon={<DownloadOutlined />} onClick={() => handleDownload('geojson')} variant="outlined">
          Download JSON
        </Button>
        <Button
          startIcon={<DownloadOutlined />}
          onClick={() => handleDownload('kml')}
          variant="contained"
          color="primary"
        >
          Download KML
        </Button>
      </DialogActions>
    </Dialog>
  )
}
