'use client'

import React, { useMemo, useState } from 'react'
import BarChartOutlined from '@mui/icons-material/BarChartOutlined'
import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import HourglassTopOutlined from '@mui/icons-material/HourglassTopOutlined'
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import Nature from '@mui/icons-material/Nature'
import Public from '@mui/icons-material/Public'
import SatelliteAlt from '@mui/icons-material/SatelliteAlt'
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined'
import ThermostatOutlined from '@mui/icons-material/ThermostatOutlined'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'

export default function AIAnalyticsPage() {
  const { currentUser } = useAuth()
  const defaultParcelId = currentUser?.allocatedParcels?.[0]?.id ?? ''
  const [selectedParcelId, setSelectedParcelId] = useState(defaultParcelId)

  const selectedParcel =
    currentUser?.allocatedParcels?.find((parcel) => parcel.id === selectedParcelId) ??
    currentUser?.allocatedParcels?.[0]

  const chartSeries = useMemo(() => {
    const area = selectedParcel?.area ?? selectedParcel?.areaHectares ?? 10
    const baseline = 36 + area * 0.45

    return [
      { month: 'Apr', canopy: baseline },
      { month: 'May', canopy: baseline + 1.8 },
      { month: 'Jun', canopy: baseline + 3.5 },
      { month: 'Jul', canopy: baseline + 5.7 },
      { month: 'Aug', canopy: baseline + 7.4 },
      { month: 'Sep', canopy: baseline + 9.3 },
      { month: 'Oct', canopy: baseline + 11.4 },
      { month: 'Nov', canopy: baseline + 13.2 },
      { month: 'Dec', canopy: baseline + 14.8 },
      { month: 'Jan', canopy: baseline + 16.3 },
      { month: 'Feb', canopy: baseline + 17.5 },
      { month: 'Mar', canopy: baseline + 18.8 },
      { month: 'Apr', canopy: baseline + 20.1 },
    ]
  }, [selectedParcel])

  const snapshots = useMemo(
    () => [
      {
        title: 'Baseline',
        canopy: `${chartSeries[0].canopy.toFixed(1)}%`,
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        textColor: '#92400e',
      },
      {
        title: '6-Month',
        canopy: `${chartSeries[5].canopy.toFixed(1)}%`,
        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
        textColor: '#166534',
      },
      {
        title: '12-Month',
        canopy: `${chartSeries[11].canopy.toFixed(1)}%`,
        background: 'linear-gradient(135deg, #6ee7b7, #34d399)',
        textColor: '#065f46',
      },
      {
        title: 'Live',
        canopy: `${chartSeries[12].canopy.toFixed(1)}%`,
        background: 'linear-gradient(135deg, #16a34a, #15803d)',
        textColor: '#dcfce7',
        live: true,
      },
    ],
    [chartSeries]
  )

  const summaryMetrics = [
    { icon: <ThermostatOutlined fontSize="small" color="warning" />, label: 'Canopy Improvement', value: '+20.1%' },
    { icon: <ForestOutlined fontSize="small" color="success" />, label: 'Biomass Index', value: 'High' },
    { icon: <Public fontSize="small" color="info" />, label: 'Moisture Stability', value: '72%' },
    { icon: <BarChartOutlined fontSize="small" color="success" />, label: 'Projected Credits', value: '+180 GC' },
    { icon: <Nature fontSize="small" color="success" />, label: 'Species Recovery', value: 'Improving' },
    { icon: <ShowChartOutlined fontSize="small" color="warning" />, label: 'Risk Level', value: 'Moderate' },
  ]

  if (!currentUser) {
    return null
  }

  if (!selectedParcel) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>No allocated parcels available for analytics.</Typography>
      </Paper>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BarChartOutlined sx={{ color: '#14532d' }} />
          <Typography variant="h4" sx={{ color: '#14532d' }}>
            AI Analytics
          </Typography>
        </Stack>

        <FormControl fullWidth sx={{ maxWidth: 400 }}>
          <InputLabel>Select Parcel</InputLabel>
          <Select
            value={selectedParcelId || selectedParcel.id}
            label="Select Parcel"
            onChange={(event: SelectChangeEvent<string>) => setSelectedParcelId(event.target.value)}
          >
            {currentUser.allocatedParcels.map((parcel) => (
              <MenuItem key={parcel.id} value={parcel.id}>
                {parcel.id} - {parcel.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <SatelliteAlt sx={{ color: '#16a34a' }} />
            <Typography variant="h6">Satellite Snapshot Timeline</Typography>
          </Stack>

          <Grid container spacing={3}>
            {snapshots.map((snapshot) => (
              <Grid key={snapshot.title} item xs={6} sm={3}>
                <Card
                  sx={{
                    position: 'relative',
                    minHeight: 140,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: 3,
                    background: snapshot.background,
                  }}
                >
                  {snapshot.live && (
                    <Chip
                      label="● LIVE"
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}

                  <Box sx={{ mb: 1 }}>
                    {snapshot.title === 'Baseline' && (
                      <Nature sx={{ fontSize: 36, color: snapshot.textColor }} />
                    )}
                    {snapshot.title === '6-Month' && (
                      <ForestOutlined sx={{ fontSize: 36, color: snapshot.textColor }} />
                    )}
                    {snapshot.title === '12-Month' && (
                      <Public sx={{ fontSize: 36, color: snapshot.textColor }} />
                    )}
                    {snapshot.title === 'Live' && (
                      <SatelliteAlt sx={{ fontSize: 36, color: snapshot.textColor }} />
                    )}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: snapshot.textColor }}>
                    {snapshot.canopy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {snapshot.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Card sx={{ borderLeft: '4px solid #16a34a' }}>
          <CardHeader title="AI Analysis Summary" />
          <CardContent>
            <Grid container spacing={2}>
              {summaryMetrics.map((metric) => (
                <Grid key={metric.label} item xs={6} sm={4} md={2}>
                  <Paper
                    sx={{
                      p: 2,
                      minHeight: 100,
                      backgroundColor: '#f0fdf4',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ mb: 0.6, display: 'flex' }}>{metric.icon}</Box>
                    <Typography variant="caption" color="text.secondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#14532d', fontWeight: 700 }}>
                      {metric.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Insights & Predictions" avatar={<LightbulbOutlined sx={{ color: '#d97706' }} />} />
          <CardContent>
            <Stack spacing={1.5}>
              {[
                {
                  icon: <HourglassTopOutlined fontSize="inherit" />,
                  severity: 'info' as const,
                  text: 'Vegetation maturation cycle indicates strong growth continuity over the next quarter.',
                },
                {
                  icon: <WarningAmberOutlined fontSize="inherit" />,
                  severity: 'warning' as const,
                  text: 'Localized moisture stress may require intervention prior to pre-monsoon heat phase.',
                },
                {
                  icon: <CheckCircleOutlineOutlined fontSize="inherit" />,
                  severity: 'success' as const,
                  text: 'Parcel is likely to cross the minimum credit eligibility threshold within this cycle.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Alert severity={item.severity} icon={item.icon}>
                    {item.text}
                  </Alert>
                </motion.div>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Canopy Density Growth" avatar={<ShowChartOutlined sx={{ color: '#16a34a' }} />} />
          <CardContent>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartSeries}>
                  <CartesianGrid stroke="#dcfce7" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #bbf7d0',
                      borderRadius: 8,
                    }}
                  />
                  <ReferenceLine
                    y={60}
                    stroke="#d97706"
                    strokeDasharray="4 4"
                    label={{ value: 'Credit Threshold 60%', fill: '#d97706', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="canopy"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: '#16a34a', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </motion.div>
  )
}
