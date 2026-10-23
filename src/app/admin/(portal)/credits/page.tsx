'use client'

import React, { useEffect, useState } from 'react'
import CalculateOutlined from '@mui/icons-material/CalculateOutlined'
import CancelOutlined from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import PauseCircleOutlined from '@mui/icons-material/PauseCircleOutlined'
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
  Grid,
  Paper,
  Skeleton,
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
import { creditApprovalRecords, CreditApprovalRecord } from '@/admin/data/adminData'

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { color: 'warning' | 'success' | 'default' | 'error'; label: string }> = {
    'Pending Approval': { color: 'warning', label: 'Pending' },
    Approved: { color: 'success', label: 'Approved' },
    'On Hold': { color: 'default', label: 'On Hold' },
    Rejected: { color: 'error', label: 'Rejected' },
  }
  const cfg = map[status] || { color: 'default', label: status }
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      sx={{ fontWeight: 700, minWidth: 72, fontSize: '0.7rem' }}
    />
  )
}

export default function CreditsPage() {
  const [records, setRecords] = useState<CreditApprovalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState<{ open: boolean; type: string; record: CreditApprovalRecord | null }>({
    open: false,
    type: '',
    record: null,
  })
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'warning' | 'error' | 'info'
  }>({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    const t = setTimeout(() => {
      setRecords(creditApprovalRecords.map((r) => ({ ...r })))
      setLoading(false)
    }, 750)
    return () => clearTimeout(t)
  }, [])

  const totalApproved = records
    .filter((r) => r.status === 'Approved')
    .reduce((s, r) => s + r.calculatedCredits, 0)
  const totalPending = records
    .filter((r) => r.status === 'Pending Approval')
    .reduce((s, r) => s + r.calculatedCredits, 0)
  const totalHeld = records
    .filter((r) => r.status === 'On Hold')
    .reduce((s, r) => s + r.calculatedCredits, 0)

  const openDialog = (type: string, record: CreditApprovalRecord) => setDialog({ open: true, type, record })
  const closeDialog = () => setDialog({ open: false, type: '', record: null })

  const handleAction = () => {
    const { type, record } = dialog
    if (!record) return
    const statusMap: Record<string, string> = { approve: 'Approved', hold: 'On Hold', reject: 'Rejected' }
    const msgMap: Record<string, string> = {
      approve: `✅ ${record.calculatedCredits.toLocaleString('en-IN')} credits approved for ${record.companyName}`,
      hold: `⏸ Credit approval for ${record.parcelId} placed on hold`,
      reject: `❌ Credit approval rejected for ${record.parcelId}`,
    }
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: statusMap[type] } : r))
    )
    setSnackbar({
      open: true,
      message: msgMap[type],
      severity: type === 'approve' ? 'success' : type === 'hold' ? 'warning' : 'error',
    })
    closeDialog()
  }

  const summaryCards = [
    { label: 'Approved', value: totalApproved, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Pending', value: totalPending, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
    { label: 'On Hold', value: totalHeld, color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  ]

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            Credit Approval
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            Review and approve Green Credits after restoration verification.
          </Typography>
        </Box>
      </motion.div>

      {/* Formula Banner */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 2.5 },
          bgcolor: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.25}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalculateOutlined sx={{ color: '#d97706', fontSize: 22, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', fontSize: '0.82rem' }}>
                Credit Calculation Formula
              </Typography>
              <Typography
                sx={{ color: '#92400e', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Green Credits = Area (hectares) × Canopy Growth (%)
              </Typography>
            </Box>
          </Stack>
          <Chip
            label="Official MoEFCC Formula"
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              fontWeight: 700,
              fontSize: '0.66rem',
              ml: { sm: 'auto' },
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          />
        </Stack>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 2.5 } }}>
        {summaryCards.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card
              sx={{
                border: `1px solid ${s.border}`,
                bgcolor: s.bg,
                '&:hover': { transform: 'translateY(-2px)' },
                transition: 'transform 0.2s',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' }, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {s.value.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.72rem' }}>
                  Credits {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Scrollable Table */}
      <Card>
        <CardContent sx={{ px: { xs: 1, sm: 1.5 }, py: { xs: 1.5, sm: 2 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, px: { xs: 0.5, sm: 0.5 }, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Credit Approval Register
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 820 }}>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Parcel</TableCell>
                  <TableCell align="right">Area (ha)</TableCell>
                  <TableCell align="right">Canopy %</TableCell>
                  <TableCell align="right">Credits</TableCell>
                  <TableCell>Formula</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 10 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : records.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#78716c', whiteSpace: 'nowrap' }}>
                          {rec.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, minWidth: 120 }}>
                          {rec.companyName}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {rec.parcelId}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                          {rec.area}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${rec.canopyIncrease}%`}
                            size="small"
                            sx={{
                              bgcolor:
                                rec.canopyIncrease >= 50
                                  ? '#f0fdf4'
                                  : rec.canopyIncrease >= 30
                                  ? '#fffbeb'
                                  : '#fff5f5',
                              color:
                                rec.canopyIncrease >= 50
                                  ? '#16a34a'
                                  : rec.canopyIncrease >= 30
                                  ? '#d97706'
                                  : '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#16a34a', fontSize: '0.88rem' }}>
                          {rec.calculatedCredits.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#78716c', whiteSpace: 'nowrap' }}>
                          {rec.formula}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.72rem', color: '#78716c', whiteSpace: 'nowrap' }}>
                          {rec.submittedOn}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={rec.status} />
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          {rec.status === 'Pending Approval' || rec.status === 'On Hold' ? (
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                              <Tooltip title="Approve credits">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => openDialog('approve', rec)}
                                  sx={{ minWidth: 0, px: 0.75, py: 0.4 }}
                                >
                                  <CheckCircleOutlined sx={{ fontSize: 16 }} />
                                </Button>
                              </Tooltip>
                              {rec.status !== 'On Hold' && (
                                <Tooltip title="Put on hold">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => openDialog('hold', rec)}
                                    sx={{ minWidth: 0, px: 0.75, py: 0.4 }}
                                  >
                                    <PauseCircleOutlined sx={{ fontSize: 16 }} />
                                  </Button>
                                </Tooltip>
                              )}
                              <Tooltip title="Reject credits">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => openDialog('reject', rec)}
                                  sx={{ minWidth: 0, px: 0.75, py: 0.4 }}
                                >
                                  <CancelOutlined sx={{ fontSize: 16 }} />
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
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.type === 'approve' && '✅ Approve Credits'}
          {dialog.type === 'hold' && '⏸ Place on Hold'}
          {dialog.type === 'reject' && '❌ Reject Credits'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.88rem' }}>
            {dialog.type === 'approve' &&
              `Approve ${dialog.record?.calculatedCredits?.toLocaleString('en-IN')} Green Credits for ${dialog.record?.companyName}?`}
            {dialog.type === 'hold' &&
              `Place credit approval for ${dialog.record?.parcelId} on hold pending additional verification?`}
            {dialog.type === 'reject' &&
              `Reject credit claim for ${dialog.record?.parcelId}? ${dialog.record?.companyName} will be notified.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={dialog.type === 'approve' ? 'success' : dialog.type === 'hold' ? 'inherit' : 'error'}
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
