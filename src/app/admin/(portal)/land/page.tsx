'use client'

import React, { useEffect, useState } from 'react'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import LandscapeOutlined from '@mui/icons-material/LandscapeOutlined'
import NatureOutlined from '@mui/icons-material/NatureOutlined'
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { companies, GLOBAL_AVAILABLE_PARCELS } from '@/data/companies'
import { landOverviewData } from '@/admin/data/adminData'
import IndiaMonitoringMap from '@/components/IndiaMonitoringMap'
import ForestMonitoringMap from '@/components/ForestMonitoringMap'

interface ParcelRow {
  id: string
  state: string
  area: number
  status: 'Active' | 'Pending' | 'Available'
  company: string
  type: string
  companyCredits?: number
}

// Build all parcel rows from shared data
function buildAllParcels(): ParcelRow[] {
  const rows: ParcelRow[] = []
  companies.forEach((c) => {
    c.allocatedParcels.forEach((p) => {
      rows.push({
        id: p.id,
        state: p.state,
        area: p.area,
        status: 'Active',
        company: c.name,
        type: 'Allocated',
        companyCredits: c.credits.earned,
      })
    })
    c.pendingParcels.forEach((p) => {
      rows.push({
        id: p.id,
        state: p.state,
        area: p.area,
        status: 'Pending',
        company: c.name,
        type: 'Pending',
        companyCredits: c.credits.earned,
      })
    })
  })
  GLOBAL_AVAILABLE_PARCELS.forEach((p) => {
    rows.push({
      id: p.id,
      state: p.state,
      area: p.area,
      status: 'Available',
      company: '—',
      type: 'Available',
    })
  })
  return rows
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
    Active: 'success',
    Available: 'info',
    Pending: 'warning',
    Restored: 'default',
  }
  return (
    <Chip
      label={status}
      color={map[status] || 'default'}
      size="small"
      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
    />
  )
}

const alloc = companies.reduce((s, c) => s + c.allocatedParcels.length, 0)
const statCards = [
  { label: 'Parcels Available', value: GLOBAL_AVAILABLE_PARCELS.length, icon: LandscapeOutlined, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Parcels Allocated', value: alloc, icon: ForestOutlined, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  { label: 'Projects Restored', value: 3, icon: TaskAltOutlined, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { label: 'Active Projects', value: alloc, icon: NatureOutlined, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
]

export default function LandPage() {
  const [parcels, setParcels] = useState<ParcelRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedParcel, setSelectedParcel] = useState<ParcelRow | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setParcels(buildAllParcels())
      setLoading(false)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            National Land Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            National-level monitoring of all land parcels under the Green Credit Programme.
          </Typography>
        </Box>
      </motion.div>

      {/* Stat Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 2.5 } }}>
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <Grid item xs={6} sm={3} key={s.label}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Card
                  sx={{
                    border: `1px solid ${s.border}`,
                    bgcolor: s.bg,
                    height: '100%',
                    '&:hover': { transform: 'translateY(-2px)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, py: { xs: 1.5, sm: 2 }, px: { xs: 1.25, sm: 2 } }}>
                    <Box
                      sx={{
                        width: { xs: 36, sm: 44 },
                        height: { xs: 36, sm: 44 },
                        borderRadius: '50%',
                        bgcolor: `${s.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: s.color,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' }, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                        {s.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', fontSize: { xs: '0.62rem', sm: '0.72rem' } }}>
                        {s.label}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )
        })}
      </Grid>

      {/* Interactive Map Row */}
      <Card sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <CardContent sx={{ p: '0 !important' }}>
          <IndiaMonitoringMap onParcelClick={(p) => setSelectedParcel(p)} />
        </CardContent>
      </Card>

      {/* Charts Row */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 2.5 } }}>
        {/* State Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
                State-wise Land Distribution (ha)
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={landOverviewData.stateDistribution}
                  margin={{ top: 4, right: 12, left: -12, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="state" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10 }} unit=" ha" />
                  <Tooltip formatter={(v) => `${v} ha`} />
                  <Bar dataKey="area" fill="#16a34a" radius={[4, 4, 0, 0]} name="Area (ha)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Restoration Progress Line */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
                National Restoration Progress
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={landOverviewData.restorationProgress}
                  margin={{ top: 4, right: 12, left: -12, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Line type="monotone" dataKey="canopy" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} name="Avg Canopy %" />
                  <Line type="monotone" dataKey="cover" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} name="Avg Cover %" strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Parcel Register Table */}
      <Card>
        <CardContent sx={{ px: { xs: 1, sm: 1.5 }, py: { xs: 1.5, sm: 2 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1} mb={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              All Parcels — National Register
            </Typography>
            {!loading && (
              <Chip
                label={`${parcels.length} total parcels`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}
              />
            )}
          </Stack>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow
                  sx={{
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      color: '#57534e',
                      bgcolor: '#f5f5f4',
                      fontSize: '0.73rem',
                      whiteSpace: 'nowrap',
                      py: 1,
                    },
                  }}
                >
                  <TableCell>Parcel ID</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell align="right">Area (ha)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : parcels.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell
                          sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          {p.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{p.state}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          {p.area}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={p.status} />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: '0.8rem',
                            color: p.company === '—' ? '#a8a29e' : '#1c1917',
                            maxWidth: 160,
                          }}
                        >
                          {p.company}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', color: '#78716c', borderColor: '#d6d3d1' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Drill-down Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedParcel)}
        onClose={() => setSelectedParcel(null)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 3, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' },
        }}
      >
        {selectedParcel && (
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#16a34a' }}>
                Parcel Details
              </Typography>
              <IconButton onClick={() => setSelectedParcel(null)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ color: '#a8a29e', fontWeight: 700 }}>
                ID • {selectedParcel.id}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selectedParcel.company || 'Unassigned'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#57534e' }}>
                State: {selectedParcel.state} • Area: {selectedParcel.area} ha
              </Typography>
              <Chip
                label={selectedParcel.status}
                size="small"
                color={selectedParcel.status === 'Active' ? 'success' : 'warning'}
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Satellite Viewer
            </Typography>
            <ForestMonitoringMap parcelId={selectedParcel.id} />

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: '#16a34a' }}>
                Generated Credits
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#166534' }}>
                {selectedParcel.companyCredits
                  ? selectedParcel.companyCredits.toLocaleString('en-IN')
                  : '--'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#14532d' }}>
                Cumulative environmental baseline impact
              </Typography>
            </Box>

            <Button variant="contained" color="success" fullWidth sx={{ mt: 4, py: 1.5, fontWeight: 700 }}>
              Verify Parcel Compliance
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}
