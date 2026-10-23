'use client'

import React, { useEffect, useState } from 'react'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlined from '@mui/icons-material/ErrorOutlined'
import GpsFixedOutlined from '@mui/icons-material/GpsFixedOutlined'
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ForestMonitoringMap from '@/components/ForestMonitoringMap'
import { verificationRecords, VerificationRecord } from '@/admin/data/adminData'

function StatusBadge({ status }: { status: string }) {
  let color: 'warning' | 'success' | 'error' | 'info' = 'warning'
  if (status === 'Ready for Approval') color = 'success'
  if (status === 'Flagged — Low Growth') color = 'error'
  if (status === 'Verification In Progress') color = 'info'
  if (status === 'Approved') color = 'success'
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 700, fontSize: '0.72rem' }}
    />
  )
}

interface MetricCardProps {
  value: string
  label: string
  color: string
  bg: string
  border: string
  progress: number
}

function MetricCard({ value, label, color, bg, border, progress }: MetricCardProps) {
  return (
    <Card sx={{ border: `1px solid ${border}`, bgcolor: bg, height: '100%', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
        <Typography sx={{ fontSize: { xs: '1.8rem', sm: '2.1rem' }, fontWeight: 800, color, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.72rem' }}>
          {label}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          sx={{
            mt: 1.25,
            borderRadius: 2,
            height: 5,
            bgcolor: `${color}20`,
            '& .MuiLinearProgress-bar': { bgcolor: color },
          }}
        />
      </CardContent>
    </Card>
  )
}

export default function VerificationPage() {
  const [records, setRecords] = useState<VerificationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState('')
  const [dialog, setDialog] = useState<{ open: boolean; type: string }>({ open: false, type: '' })
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'warning' | 'error' | 'info'
  }>({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    const t = setTimeout(() => {
      setRecords(verificationRecords.map((r) => ({ ...r })))
      setLoading(false)
      setSelectedId(verificationRecords[0]?.id || '')
    }, 800)
    return () => clearTimeout(t)
  }, [])

  const selected = records.find((r) => r.id === selectedId)

  const handleAction = (type: string) => {
    setDialog({ open: false, type: '' })
    if (!selected) return

    const statusMap: Record<string, string> = {
      approve: 'Approved',
      inspect: 'Manual Inspection Requested',
      reject: 'Rejected',
    }
    const msgMap: Record<string, string> = {
      approve: `✅ Restoration approved for ${selected.parcelId}`,
      inspect: `🔍 Manual inspection scheduled for ${selected.parcelId}`,
      reject: `❌ Restoration rejected for ${selected.parcelId}`,
    }
    setRecords((prev) =>
      prev.map((r) => (r.id === selectedId ? { ...r, status: statusMap[type] } : r))
    )
    setSnackbar({
      open: true,
      message: msgMap[type],
      severity: type === 'approve' ? 'success' : type === 'inspect' ? 'warning' : 'error',
    })
  }

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            Restoration Verification
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            Satellite analytics and field verification data for active restoration projects.
          </Typography>
        </Box>
      </motion.div>

      {/* Parcel Selector */}
      <Card sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
          <FormControl size="small" fullWidth sx={{ maxWidth: { sm: 420 } }}>
            <InputLabel>Select Parcel for Verification</InputLabel>
            <Select
              value={selectedId}
              label="Select Parcel for Verification"
              onChange={(e: SelectChangeEvent<string>) => setSelectedId(e.target.value)}
            >
              {loading ? (
                <MenuItem disabled>Loading…</MenuItem>
              ) : (
                records.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontSize: '0.85rem' }}>{r.parcelId}</Typography>
                      <Typography variant="caption" sx={{ color: '#78716c' }}>
                        — {r.companyName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {loading && (
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
          </CardContent>
        </Card>
      )}

      {/* Detail panel */}
      {!loading && selected && (
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {/* Parcel Header */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1.5}
                    flexWrap="wrap"
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                        {selected.parcelId}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#78716c', fontSize: '0.8rem' }}>
                        {selected.parcelLocation} · {selected.area} ha · {selected.companyName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                        Started: {selected.startDate} · Last verified: {selected.lastVerified}
                      </Typography>
                    </Box>
                    <StatusBadge status={selected.status} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Metrics row */}
            <Grid item xs={6} sm={3}>
              <MetricCard
                value={`${selected.currentCanopy}%`}
                label="Canopy Density"
                color="#16a34a"
                bg="#f0fdf4"
                border="#bbf7d0"
                progress={selected.currentCanopy}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MetricCard
                value={`${selected.forestCoverIncrease}%`}
                label="Forest Cover"
                color="#0284c7"
                bg="#f0f9ff"
                border="#bae6fd"
                progress={selected.forestCoverIncrease}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MetricCard
                value={`${selected.verifiedBy}/${selected.requiredVerifications}`}
                label="Officers Verified"
                color="#7c3aed"
                bg="#faf5ff"
                border="#e9d5ff"
                progress={(selected.verifiedBy / selected.requiredVerifications) * 100}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  height: '100%',
                  border: selected.flagged ? '1px solid #fecaca' : '1px solid #d1fae5',
                  bgcolor: selected.flagged ? '#fff5f5' : '#f0fdf4',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    py: { xs: 1.5, sm: 2 },
                  }}
                >
                  {selected.flagged ? (
                    <ErrorOutlined sx={{ color: '#dc2626', fontSize: { xs: 32, sm: 38 }, mb: 0.5 }} />
                  ) : (
                    <CheckCircleOutlined sx={{ color: '#16a34a', fontSize: { xs: 32, sm: 38 }, mb: 0.5 }} />
                  )}
                  <Typography variant="caption" sx={{ color: '#4b5563', textAlign: 'center', fontSize: '0.68rem' }}>
                    {selected.flagged ? 'Flagged' : 'No Issues'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Map and AI Insights Row */}
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: 1 }}>
              <Grid item xs={12} lg={8}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                      <GpsFixedOutlined sx={{ color: '#16a34a', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Satellite View
                      </Typography>
                    </Stack>
                    <ForestMonitoringMap parcelId={selected.parcelId} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                      <PsychologyOutlined sx={{ color: '#7c3aed', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
                        AI Insights
                      </Typography>
                    </Stack>

                    <Stack spacing={1.5} flexGrow={1}>
                      <Alert severity="success" sx={{ fontSize: '0.8rem', alignItems: 'center' }}>
                        Vegetation density increased by 21%
                      </Alert>
                      <Alert severity="info" sx={{ fontSize: '0.8rem', alignItems: 'center' }}>
                        Biomass index: High
                      </Alert>
                      <Alert severity="info" sx={{ fontSize: '0.8rem', alignItems: 'center' }}>
                        Soil moisture stability: 72%
                      </Alert>
                      {selected.flagged && (
                        <Alert severity="error" sx={{ fontSize: '0.8rem', alignItems: 'center' }}>
                          Minor drought stress detected in northern sector.
                        </Alert>
                      )}

                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Typography variant="overline" sx={{ fontWeight: 700, color: '#78716c' }}>
                          Projected Credits
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#16a34a' }}>
                          +{(selected.area * 15).toFixed(0)}{' '}
                          <Typography component="span" sx={{ fontSize: '1rem', color: '#16a34a' }}>
                            Green Credits
                          </Typography>
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Growth Chart */}
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
                    Satellite Timeline — Growth Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selected.timeline} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit="%" />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                      <Line
                        type="monotone"
                        dataKey="canopyDensity"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#16a34a' }}
                        name="Canopy Density %"
                      />
                      <Line
                        type="monotone"
                        dataKey="forestCover"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#0284c7' }}
                        name="Forest Cover %"
                        strokeDasharray="6 3"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Verification Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Card sx={{ border: '1px solid #e7e5e4' }}>
                <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <GpsFixedOutlined sx={{ color: '#d97706', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
                      Verification Decision
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#78716c', mb: 2, fontSize: '0.82rem' }}>
                    Verified by {selected.verifiedBy} of {selected.requiredVerifications} required officers.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleOutlined />}
                      onClick={() => setDialog({ open: true, type: 'approve' })}
                      disabled={selected.status === 'Approved'}
                      size="small"
                    >
                      Approve Restoration
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<WarningAmberOutlined />}
                      onClick={() => setDialog({ open: true, type: 'inspect' })}
                      size="small"
                    >
                      Manual Inspection
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<ErrorOutlined />}
                      onClick={() => setDialog({ open: true, type: 'reject' })}
                      disabled={selected.status === 'Rejected'}
                      size="small"
                    >
                      Reject
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, type: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.type === 'approve' && '✅ Approve Restoration'}
          {dialog.type === 'inspect' && '🔍 Request Manual Inspection'}
          {dialog.type === 'reject' && '❌ Reject Restoration'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.88rem' }}>
            {dialog.type === 'approve' &&
              `Confirm restoration approval for ${selected?.parcelId}. This will initiate credit calculation.`}
            {dialog.type === 'inspect' &&
              `Schedule a manual field inspection for ${selected?.parcelId}. A team will be dispatched.`}
            {dialog.type === 'reject' &&
              `Reject restoration for ${selected?.parcelId}. ${selected?.companyName} will be notified.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog({ open: false, type: '' })} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={
              dialog.type === 'approve' ? 'success' : dialog.type === 'inspect' ? 'warning' : 'error'
            }
            onClick={() => handleAction(dialog.type)}
            sx={{ fontWeight: 700 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          sx={{ fontSize: '0.82rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
