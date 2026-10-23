'use client'

import React, { useState } from 'react'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import EmojiNature from '@mui/icons-material/EmojiNature'
import Forest from '@mui/icons-material/Forest'
import MapOutlined from '@mui/icons-material/MapOutlined'
import Recycling from '@mui/icons-material/Recycling'
import RoomOutlined from '@mui/icons-material/RoomOutlined'
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined'
import {
  Avatar,
  Box,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
} from '@mui/material'
import { motion } from 'framer-motion'
import ParcelMapDialog from '@/components/ParcelMapDialog'
import { useAuth } from '@/context/AuthContext'
import { LandParcel } from '@/types'

export default function CompanyDashboardPage() {
  const { currentUser } = useAuth()
  const [selectedParcelForMap, setSelectedParcelForMap] = useState<LandParcel | null>(null)

  if (!currentUser) {
    return null
  }

  const totalLand = currentUser.allocatedParcels.reduce(
    (sum, parcel) => sum + (parcel.area || parcel.areaHectares || 0),
    0
  )

  const verificationStatus =
    currentUser.pendingParcels.length > 0 ? 'Pending ICFRE Review' : 'ICFRE Verified'

  const handleViewOnMap = (parcel: LandParcel) => {
    setSelectedParcelForMap(parcel)
  }

  const initials = currentUser.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')

  const statCards = [
    {
      label: 'Total Land',
      value: `${totalLand.toFixed(1)} ha`,
      icon: <Forest sx={{ color: '#16a34a' }} />,
      bg: '#dcfce7',
    },
    {
      label: 'Credits Earned',
      value: currentUser.credits.earned,
      icon: <EmojiNature sx={{ color: '#d97706' }} />,
      bg: '#fef3c7',
    },
    {
      label: 'Credits Redeemed',
      value: currentUser.credits.redeemed,
      icon: <Recycling sx={{ color: '#2563eb' }} />,
      bg: '#dbeafe',
    },
    {
      label: 'Verification Status',
      value: verificationStatus,
      icon: <VerifiedOutlined sx={{ color: '#7c3aed' }} />,
      bg: '#ede9fe',
    },
  ]

  const scrollToPendingApplications = () => {
    document
      .getElementById('pending-applications-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <DashboardOutlined sx={{ color: '#14532d' }} />
          <Typography variant="h4" sx={{ color: '#14532d' }}>
            Company Dashboard
          </Typography>
        </Stack>

        <Card sx={{ borderLeft: '4px solid #16a34a' }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: '#16a34a' }}>{initials}</Avatar>}
            title={currentUser.name}
            subheader={currentUser.CIN || currentUser.cin}
            action={<Chip label="Active Participant" color="success" size="small" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              {[
                { label: 'Sector', value: currentUser.sector },
                { label: 'State', value: currentUser.state },
                { label: 'Contact Person', value: currentUser.contactPerson },
                { label: 'Email', value: currentUser.email },
                { label: 'Registered On', value: currentUser.registeredOn },
              ].map((field) => (
                <Grid key={field.label} item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#14532d', fontWeight: 500 }}>
                    {field.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {statCards.map((card, index) => (
            <Grid key={card.label} item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tooltip
                  title="1 parcel is awaiting ICFRE verification. Click to review."
                  placement="top"
                  disableHoverListener={card.label !== 'Verification Status'}
                >
                  <Card
                    onClick={card.label === 'Verification Status' ? scrollToPendingApplications : undefined}
                    sx={
                      card.label === 'Verification Status'
                        ? {
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s',
                            '&:hover': { boxShadow: 6 },
                          }
                        : undefined
                    }
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          bgcolor: card.bg,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ color: '#14532d', fontWeight: 700 }}>
                          {card.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Tooltip>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardHeader
            title={
              <Stack direction="row" spacing={1} alignItems="center">
                <MapOutlined sx={{ color: '#14532d' }} />
                <Typography variant="h6">Allocated Land Parcels</Typography>
              </Stack>
            }
            action={
              <Chip
                label={`${currentUser.allocatedParcels.length} Parcels`}
                color="success"
                variant="outlined"
              />
            }
          />
          <CardContent>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0fdf4' }}>
                    {['Parcel ID', 'Location', 'Area (ha)', 'State', 'Allotted On', 'Status', 'Action'].map(
                      (label) => (
                        <TableCell key={label} sx={{ fontWeight: 700, color: '#14532d' }}>
                          {label}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUser.allocatedParcels.map((parcel, idx) => (
                    <TableRow key={parcel.id} sx={{ backgroundColor: idx % 2 ? '#fafafa' : '#ffffff' }}>
                      <TableCell sx={{ fontWeight: 600 }}>{parcel.id}</TableCell>
                      <TableCell>{parcel.location}</TableCell>
                      <TableCell>{parcel.area ?? parcel.areaHectares}</TableCell>
                      <TableCell>{parcel.state}</TableCell>
                      <TableCell>{parcel.allottedOn}</TableCell>
                      <TableCell>
                        <Chip
                          label={parcel.status}
                          color={parcel.status === 'Active' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          startIcon={<RoomOutlined />}
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleViewOnMap(parcel)}
                        >
                          View on Map
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      <ParcelMapDialog
        open={Boolean(selectedParcelForMap)}
        parcel={selectedParcelForMap}
        onClose={() => setSelectedParcelForMap(null)}
      />
    </motion.div>
  )
}
