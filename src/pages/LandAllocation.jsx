import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined'
import AddLocationAlt from '@mui/icons-material/AddLocationAlt'
import FiberNew from '@mui/icons-material/FiberNew'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import HourglassTopOutlined from '@mui/icons-material/HourglassTopOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import LocationOn from '@mui/icons-material/LocationOn'
import MapOutlined from '@mui/icons-material/MapOutlined'
import PublicOutlined from '@mui/icons-material/PublicOutlined'
import RoomOutlined from '@mui/icons-material/RoomOutlined'
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined'
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import ParcelMapDialog from '../components/ParcelMapDialog'
import { useAuth } from '../context/AuthContext'
import { companies, GLOBAL_AVAILABLE_PARCELS } from '../data/companies'
import { api } from '../utils/api'

const RANK_LIMITS = {
  PLATINUM: 50.0,
  GOLD: 25.0,
  SILVER: 15.0,
  BRONZE: 5.0,
}

function LandAllocation() {
  const { currentUser } = useAuth()
  const [selectedState, setSelectedState] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')
  const [selectedDegradation, setSelectedDegradation] = useState('All')
  const [appliedParcelIds, setAppliedParcelIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('gcp_applied_parcels') || '[]')
    } catch {
      return []
    }
  })
  const [applicationMessage, setApplicationMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [selectedParcelForMap, setSelectedParcelForMap] = useState(null)

  const companyRank = currentUser?.rank || 'SILVER'
  const maxAllowedArea = RANK_LIMITS[companyRank] || 15.0

  const handleViewOnMap = (parcel) => {
    setSelectedParcelForMap(parcel)
  }

  const stateOptions = useMemo(
    () => ['All', ...new Set(GLOBAL_AVAILABLE_PARCELS.map((parcel) => parcel.state))],
    [],
  )

  const filteredParcels = GLOBAL_AVAILABLE_PARCELS.filter((parcel) => {
    const stateMatch = selectedState === 'All' || parcel.state === selectedState

    const areaMatch =
      selectedArea === 'All' ||
      (selectedArea === 'Eligible' && parcel.area <= maxAllowedArea) ||
      (selectedArea === '<10' && parcel.area < 10) ||
      (selectedArea === '10-20' && parcel.area >= 10 && parcel.area <= 20) ||
      (selectedArea === '>20' && parcel.area > 20)

    const degradationMatch =
      selectedDegradation === 'All' || parcel.degradation === selectedDegradation

    return stateMatch && areaMatch && degradationMatch
  })

  const allAllocatedParcels = companies
    .flatMap((company) =>
      company.allocatedParcels.map((parcel) => ({
        ...parcel,
        allocatedTo: company.name,
        sector: company.sector,
        companyId: company.id,
      })),
    )
    .sort((a, b) => new Date(b.allottedOn) - new Date(a.allottedOn))

  const resetFilters = () => {
    setSelectedState('All')
    setSelectedArea('All')
    setSelectedDegradation('All')
  }

  const handleApply = async (parcel) => {
    if (parcel.area > maxAllowedArea) {
      setApplicationMessage(`Application blocked: Parcel size (${parcel.area} ha) exceeds your company's ${companyRank} tier limit (${maxAllowedArea} ha).`)
      setSnackbarOpen(true)
      return
    }

    try {
      if (currentUser?.id) {
        await api.applyForParcel(currentUser.id, parcel.id)
      }
      setAppliedParcelIds((prev) => {
        const updated = prev.includes(parcel.id) ? prev : [...prev, parcel.id]
        sessionStorage.setItem('gcp_applied_parcels', JSON.stringify(updated))
        return updated
      })
      setApplicationMessage(`Application successfully submitted for ${parcel.id}. Under review by ICFRE / MoEFCC Nodal Officer.`)
      setSnackbarOpen(true)
    } catch (e) {
      setApplicationMessage(e.message || `Could not submit an application for ${parcel.id}.`)
      setSnackbarOpen(true)
    }
  }

  const appliedParcels = useMemo(
    () =>
      appliedParcelIds
        .map((id) => GLOBAL_AVAILABLE_PARCELS.find((parcel) => parcel.id === id))
        .filter(Boolean),
    [appliedParcelIds],
  )

  const availableParcels = filteredParcels.filter(
    (parcel) => !appliedParcelIds.includes(parcel.id),
  )

  const degradationColors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MapOutlined sx={{ color: '#14532d' }} />
          <Typography variant="h4" sx={{ color: '#14532d' }}>
            Land Allocation
          </Typography>
        </Stack>

        {currentUser.pendingParcels.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Alert
              severity="warning"
              icon={<HourglassTopOutlined />}
              sx={{
                mb: 0,
                borderRadius: 2,
                border: '1px solid #fcd34d',
                '& .MuiAlert-icon': { color: '#d97706' },
              }}
            >
              <AlertTitle>Applications Under Review</AlertTitle>
              <TableContainer component={Paper} elevation={0} sx={{ mt: 1, backgroundColor: 'transparent', overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['Parcel ID', 'Location', 'Area', 'State', 'Applied On', 'Status', 'Map'].map((label) => (
                        <TableCell key={label} sx={{ fontWeight: 700 }}>{label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentUser.pendingParcels.map((parcel) => (
                      <TableRow key={parcel.id} sx={{ backgroundColor: '#fef3c7' }}>
                        <TableCell>{parcel.id}</TableCell>
                        <TableCell>{parcel.location}</TableCell>
                        <TableCell>{parcel.area} ha</TableCell>
                        <TableCell>{parcel.state}</TableCell>
                        <TableCell>{parcel.appliedOn}</TableCell>
                        <TableCell>
                          <Chip
                            label="Pending ICFRE Review"
                            color="warning"
                            size="small"
                            sx={{ animation: 'pulse-opacity 1.5s infinite' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<RoomOutlined />}
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
            </Alert>
          </motion.div>
        )}

        {appliedParcelIds.length > 0 && (
          <Box
            id="pending-applications-section"
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(180, 100, 0, 0.15)',
              borderLeft: '4px solid',
              borderColor: 'warning.main',
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
              <HourglassEmptyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Pending Applications</Typography>
              <Chip label={appliedParcelIds.length} color="warning" size="small" sx={{ ml: 1 }} />
            </Stack>

            <Grid container spacing={2}>
              {appliedParcels.map((parcel) => (
                <Grid key={parcel.id} item xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <Card>
                      <CardContent>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2">Parcel ID: {parcel.id}</Typography>
                          <Typography variant="body2">Location: {parcel.location}</Typography>
                          <Typography variant="body2">Area: {parcel.area} ha</Typography>
                          <Typography variant="body2">State: {parcel.state}</Typography>
                          <Chip
                            label="Pending ICFRE Review"
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{ width: 'fit-content', mt: 1 }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiberNew sx={{ color: '#16a34a' }} />
            Available Land Parcels — Open for Allocation
          </Typography>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>State</InputLabel>
              <Select value={selectedState} label="State" onChange={(event) => setSelectedState(event.target.value)}>
                <MenuItem value="All">All States</MenuItem>
                {stateOptions
                  .filter((state) => state !== 'All')
                  .map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Area Range</InputLabel>
              <Select value={selectedArea} label="Area Range" onChange={(event) => setSelectedArea(event.target.value)}>
                <MenuItem value="All">All Sizes</MenuItem>
                <MenuItem value="<10">&lt; 10 ha</MenuItem>
                <MenuItem value="10-20">10-20 ha</MenuItem>
                <MenuItem value=">20">&gt; 20 ha</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Degradation</InputLabel>
              <Select
                value={selectedDegradation}
                label="Degradation"
                onChange={(event) => setSelectedDegradation(event.target.value)}
              >
                <MenuItem value="All">All Levels</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            <Button color="inherit" onClick={resetFilters}>Reset Filters</Button>
          </Stack>

          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
          >
            <Grid container spacing={2}>
              {availableParcels.map((p) => (
                <Grid key={p.id} item xs={12} sm={6} md={4} lg={3}>
                  <motion.div variants={{ initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } }}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip label={p.degradation} size="small" color={degradationColors[p.degradation]} />
                          <Chip label={p.forestType} size="small" variant="outlined" />
                        </Stack>

                        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                          {p.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn fontSize="small" />
                          {p.state}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Area</Typography>
                          <Typography variant="body2">{p.area} ha</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">Parcel ID</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.77rem' }}>{p.id}</Typography>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ px: 2, pb: 2, display: 'grid', gap: 1 }}>
                        <Button
                          startIcon={<RoomOutlined />}
                          variant="outlined"
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() => handleViewOnMap(p)}
                        >
                          📍 View on Map
                        </Button>
                        <Button
                          startIcon={<AddLocationAlt />}
                          variant="contained"
                          color="primary"
                          size="small"
                          fullWidth
                          disabled={appliedParcelIds.includes(p.id)}
                          sx={appliedParcelIds.includes(p.id) ? { opacity: 0.6 } : undefined}
                          onClick={() => handleApply(p)}
                        >
                          {appliedParcelIds.includes(p.id)
                            ? 'Application Submitted'
                            : 'Apply for Allocation'}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PublicOutlined sx={{ color: '#14532d' }} />
            All Allocated Land — National Overview
          </Typography>

          <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 2 }}>
            Showing all nationally allocated parcels. Your company's parcels are highlighted in green.
          </Alert>

          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#16a34a' }}>
                  {['Parcel ID', 'Location', 'Area', 'State', 'Allocated To', 'Sector', 'Allotted On', 'Action'].map((label) => (
                    <TableCell key={label} sx={{ color: '#fff', fontWeight: 700 }}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allAllocatedParcels.map((parcel, index) => {
                  const isMine = parcel.companyId === currentUser.id
                  const initials = parcel.allocatedTo
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join('')

                  return (
                    <TableRow key={parcel.id} sx={{ backgroundColor: isMine ? '#dcfce7' : index % 2 ? '#fafafa' : '#fff' }}>
                      <TableCell sx={{ borderLeft: isMine ? '3px solid #16a34a' : '3px solid transparent', fontWeight: 600 }}>
                        {parcel.id}
                      </TableCell>
                      <TableCell>{parcel.location}</TableCell>
                      <TableCell>{parcel.area} ha</TableCell>
                      <TableCell>{parcel.state}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#16a34a' }}>
                            {initials}
                          </Avatar>
                          <Typography variant="body2">{parcel.allocatedTo}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{parcel.sector}</TableCell>
                      <TableCell>{parcel.allottedOn}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<RoomOutlined />}
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewOnMap(parcel)}
                        >
                          View on Map
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AccountTreeOutlined sx={{ color: '#14532d' }} />
            <Typography variant="h6">My Allocated Parcels</Typography>
            <Chip label={currentUser.allocatedParcels.length} color="success" size="small" />
          </Stack>

          {currentUser.allocatedParcels.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #cbd5e1', borderRadius: 2, bgcolor: '#fff' }}>
              <ForestOutlined sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
              <Typography color="text.secondary">No parcels currently allocated to your account.</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#16a34a' }}>
                    {['Parcel ID', 'Location', 'Area', 'State', 'Sector', 'Allotted On', 'Action'].map((label) => (
                      <TableCell key={label} sx={{ color: '#fff', fontWeight: 700 }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUser.allocatedParcels.map((parcel, index) => (
                    <TableRow key={parcel.id} sx={{ backgroundColor: index % 2 ? '#fafafa' : '#fff' }}>
                      <TableCell sx={{ fontWeight: 600 }}>{parcel.id}</TableCell>
                      <TableCell>{parcel.location}</TableCell>
                      <TableCell>{parcel.area} ha</TableCell>
                      <TableCell>{parcel.state}</TableCell>
                      <TableCell>{currentUser.sector}</TableCell>
                      <TableCell>{parcel.allottedOn}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<RoomOutlined />}
                          size="small"
                          variant="outlined"
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
          )}
        </Box>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          {applicationMessage}
        </Alert>
      </Snackbar>

      <ParcelMapDialog
        open={Boolean(selectedParcelForMap)}
        parcel={selectedParcelForMap}
        onClose={() => setSelectedParcelForMap(null)}
      />
    </motion.div>
  )
}

export default LandAllocation
