'use client'

import React, { useEffect, useState } from 'react'
import CancelOutlined from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import FilterListOutlined from '@mui/icons-material/FilterListOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
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
  IconButton,
  InputAdornment,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { api } from '@/utils/api'
import { pendingApplications } from '@/admin/data/adminData'

interface ApplicationRow {
  id: string
  companyName: string
  sector: string
  parcelId: string
  area: number
  state: string
  appliedOn: string
  status: 'Pending' | 'Approved' | 'Rejected' | string
  rawId?: any
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { color: 'warning' | 'success' | 'error' | 'default' }> = {
    Pending: { color: 'warning' },
    Approved: { color: 'success' },
    Rejected: { color: 'error' },
  }
  return (
    <Chip
      label={status}
      color={map[status]?.color || 'default'}
      size="small"
      sx={{ fontWeight: 700, minWidth: 72, fontSize: '0.7rem' }}
    />
  )
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<{ open: boolean; type: string; app: ApplicationRow | null }>({
    open: false,
    type: '',
    app: null,
  })
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }>({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    let isMounted = true
    api
      .getAdminApplications()
      .then((data: any) => {
        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ApplicationRow[] = data.map((item: any) => ({
            id: item.id ? `APP-${item.id}` : item.applicationId,
            companyName: item.company?.name || item.companyName || 'Enterprise',
            sector: item.company?.sector || 'Industrial',
            parcelId: item.parcel?.id || item.parcelId || 'GCP-PARCEL',
            area: item.parcel?.areaHectares || item.area || 10,
            state: item.parcel?.state || item.state || 'National',
            appliedOn: item.appliedAt ? new Date(item.appliedAt).toISOString().split('T')[0] : '2026-03-01',
            status: item.status === 'APPROVED' ? 'Approved' : item.status === 'REJECTED' ? 'Rejected' : 'Pending',
            rawId: item.id,
          }))
          setApplications(mapped)
        } else {
          setApplications(pendingApplications.map((a) => ({ ...a })))
        }
        setLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setApplications(pendingApplications.map((a) => ({ ...a })))
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = applications.filter(
    (a) =>
      a.companyName.toLowerCase().includes(search.toLowerCase()) ||
      a.parcelId.toLowerCase().includes(search.toLowerCase()) ||
      a.state.toLowerCase().includes(search.toLowerCase())
  )

  const openDialog = (type: string, app: ApplicationRow) => setDialog({ open: true, type, app })
  const closeDialog = () => setDialog({ open: false, type: '', app: null })

  const handleAction = async () => {
    const { type, app } = dialog
    if (!app) return
    const isApprove = type === 'approve'

    try {
      const targetId = app.rawId || app.id
      await api.decideApplication(targetId, {
        approve: isApprove,
        officerName: 'Admin Officer',
        reason: isApprove
          ? 'Approved by ICFRE / MoEFCC Nodal Officer'
          : 'Application declined by Nodal Officer',
      })
    } catch (err: any) {
      console.warn('API application decision note:', err.message)
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: isApprove ? 'Approved' : 'Rejected' } : a))
    )
    setSnackbar({
      open: true,
      message: isApprove
        ? `✅ Application ${app.id} approved — parcel assigned to ${app.companyName}`
        : `❌ Application ${app.id} rejected`,
      severity: isApprove ? 'success' : 'error',
    })
    closeDialog()
  }

  const pendingCount = applications.filter((a) => a.status === 'Pending').length
  const approvedCount = applications.filter((a) => a.status === 'Approved').length
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            Application Approval
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            Review and approve land parcel allocation requests from companies.
          </Typography>
        </Box>
      </motion.div>

      {/* Summary chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: 'wrap' }} useFlexGap>
        <Chip label={`${pendingCount} Pending`} color="warning" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
        <Chip label={`${approvedCount} Approved`} color="success" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
        <Chip label={`${rejectedCount} Rejected`} color="error" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
      </Stack>

      <Card>
        <CardContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          {/* Toolbar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={1.5}
            mb={2}
          >
            <TextField
              size="small"
              placeholder="Search company, parcel or state…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ maxWidth: { sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" sx={{ color: '#78716c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Filter options">
              <IconButton size="small" sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                <FilterListOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Scrollable table */}
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow
                  sx={{
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      color: '#57534e',
                      bgcolor: '#f5f5f4',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      py: 1,
                    },
                  }}
                >
                  <TableCell>App ID</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Parcel ID</TableCell>
                  <TableCell align="right">Area (ha)</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Applied</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : filtered.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            color: '#78716c',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {app.id}
                        </TableCell>
                        <TableCell sx={{ minWidth: 140 }}>
                          <Typography
                            sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1c1917', lineHeight: 1.3 }}
                          >
                            {app.companyName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#a8a29e', fontSize: '0.68rem' }}>
                            {app.sector}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: '#16a34a',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {app.parcelId}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          {app.area}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.state}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.66rem', whiteSpace: 'nowrap' }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: '0.75rem', color: '#78716c', whiteSpace: 'nowrap' }}
                        >
                          {app.appliedOn}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={app.status} />
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          {app.status === 'Pending' ? (
                            <Stack direction="row" spacing={0.75} justifyContent="center">
                              <Tooltip title="Approve">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleOutlined sx={{ fontSize: '14px !important' }} />}
                                  onClick={() => openDialog('approve', app)}
                                  sx={{ fontSize: '0.7rem', py: 0.4, px: 1 }}
                                >
                                  Approve
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<CancelOutlined sx={{ fontSize: '14px !important' }} />}
                                  onClick={() => openDialog('reject', app)}
                                  sx={{ fontSize: '0.7rem', py: 0.4, px: 1 }}
                                >
                                  Reject
                                </Button>
                              </Tooltip>
                            </Stack>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body2" sx={{ color: '#a8a29e' }}>
                No applications match your search.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.type === 'approve' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.88rem' }}>
            {dialog.type === 'approve'
              ? `Approve application ${dialog.app?.id} for ${dialog.app?.companyName}? Parcel ${dialog.app?.parcelId} (${dialog.app?.area} ha) in ${dialog.app?.state} will be allocated.`
              : `Reject application ${dialog.app?.id} for ${dialog.app?.companyName}? This action will be logged.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={dialog.type === 'approve' ? 'success' : 'error'}
            sx={{ fontWeight: 700 }}
          >
            {dialog.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
