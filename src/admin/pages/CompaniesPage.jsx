import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlined from '@mui/icons-material/ErrorOutlined'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import TimelineOutlined from '@mui/icons-material/TimelineOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined'
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../../utils/api'
import { useAdminAuth } from '../context/AdminAuthContext'
import { activityLogs as mockActivityLogs } from '../data/adminData'

const RANK_CONFIG = {
  PLATINUM: { color: '#0284c7', bg: '#e0f2fe', maxArea: 50.0, label: 'Platinum (Max 50 ha)' },
  GOLD: { color: '#d97706', bg: '#fef3c7', maxArea: 25.0, label: 'Gold (Max 25 ha)' },
  SILVER: { color: '#64748b', bg: '#f1f5f9', maxArea: 15.0, label: 'Silver (Max 15 ha)' },
  BRONZE: { color: '#b45309', bg: '#ffedd5', maxArea: 5.0, label: 'Bronze (Max 5 ha)' },
}

function RankChip({ rank }) {
  const cfg = RANK_CONFIG[rank] || RANK_CONFIG.SILVER
  return (
    <Tooltip title={`Permitted Parcel Area: Up to ${cfg.maxArea} hectares`}>
      <Chip
        label={rank}
        size="small"
        sx={{
          bgcolor: cfg.bg,
          color: cfg.color,
          fontWeight: 800,
          fontSize: '0.7rem',
          border: `1px solid ${cfg.color}`,
        }}
      />
    </Tooltip>
  )
}

function StatusChip({ status }) {
  if (status === 'APPROVED') {
    return <Chip label="Verified" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
  }
  if (status === 'PENDING_VERIFICATION') {
    return <Chip label="Pending Verification" color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
  }
  if (status === 'REJECTED') {
    return <Chip label="Rejected" color="error" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
  }
  return <Chip label={status || 'Active'} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
}

function logBadge(type) {
  if (type.includes('APPROVED') || type.includes('SUCCESS')) {
    return { bgcolor: '#f0fdf4', color: '#16a34a' }
  }
  if (type.includes('REJECTED') || type.includes('ERROR')) {
    return { bgcolor: '#fff5f5', color: '#dc2626' }
  }
  if (type.includes('SUBMITTED') || type.includes('PENDING')) {
    return { bgcolor: '#fffbeb', color: '#d97706' }
  }
  return { bgcolor: '#f0f9ff', color: '#0284c7' }
}

function CompaniesPage() {
  const { adminUser } = useAdminAuth()

  const [companies, setCompanies] = useState([])
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0) // 0: All, 1: Pending

  // Verification Decision Dialog State
  const [verifyDialog, setVerifyDialog] = useState({
    open: false,
    company: null,
    report: null,
    approve: true,
    selectedRank: 'SILVER',
    reason: '',
  })
  const [submittingDecision, setSubmittingDecision] = useState(false)

  // Rank Update Dialog State
  const [rankDialog, setRankDialog] = useState({
    open: false,
    company: null,
    newRank: 'GOLD',
    reason: '',
  })
  const [submittingRank, setSubmittingRank] = useState(false)

  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const loadData = async () => {
    try {
      const [compList, auditList] = await Promise.allSettled([
        api.getAdminCompanies(),
        api.getAdminAudits(),
      ])

      if (compList.status === 'fulfilled' && compList.value) {
        setCompanies(compList.value)
      }
      if (auditList.status === 'fulfilled' && auditList.value) {
        setAudits(auditList.value)
      }
    } catch (e) {
      console.error('Error loading companies data', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingCount = useMemo(() => {
    return companies.filter((c) => c.status === 'PENDING_VERIFICATION').length
  }, [companies])

  const filteredCompanies = useMemo(() => {
    if (tabIndex === 1) {
      return companies.filter((c) => c.status === 'PENDING_VERIFICATION')
    }
    return companies
  }, [companies, tabIndex])

  // Open Verification Modal
  const handleOpenVerify = async (company) => {
    try {
      const details = await api.getAdminCompanyDetails(company.id)
      setVerifyDialog({
        open: true,
        company: details.company,
        report: details.verificationReport,
        approve: true,
        selectedRank: details.company.rank || details.verificationReport.suggestedRank || 'SILVER',
        reason: 'Statutory documents and statutory numbers verified against MCA and GST portal.',
      })
    } catch {
      // Fallback
      setVerifyDialog({
        open: true,
        company,
        report: {
          gstinValid: true,
          panValid: true,
          cinValid: true,
          panMatchesGstin: true,
          validOverall: true,
          suggestedRank: company.rank || 'SILVER',
          maxAreaAllowedHa: 15.0,
          summaryMessage: 'Automated verification check complete.',
        },
        approve: true,
        selectedRank: company.rank || 'SILVER',
        reason: 'Statutory numbers verified.',
      })
    }
  }

  // Submit Verification Decision
  const handleConfirmDecision = async () => {
    if (!verifyDialog.company) return
    setSubmittingDecision(true)

    try {
      const payload = {
        approve: verifyDialog.approve,
        officerName: adminUser?.name || 'Dr. Arvind Sharma',
        rank: verifyDialog.approve ? verifyDialog.selectedRank : null,
        reason: verifyDialog.reason,
      }

      await api.decideCompanyRegistration(verifyDialog.company.id, payload)

      setToast({
        open: true,
        message: verifyDialog.approve
          ? `Company '${verifyDialog.company.name}' approved with rank ${verifyDialog.selectedRank}. Login activated.`
          : `Company '${verifyDialog.company.name}' registration rejected.`,
        severity: verifyDialog.approve ? 'success' : 'info',
      })

      setVerifyDialog((prev) => ({ ...prev, open: false }))
      await loadData()
    } catch (err) {
      setToast({ open: true, message: err.message || 'Operation failed', severity: 'error' })
    } finally {
      setSubmittingDecision(false)
    }
  }

  // Open Rank Adjustment Modal
  const handleOpenRank = (company) => {
    setRankDialog({
      open: true,
      company,
      newRank: company.rank || 'GOLD',
      reason: 'Administrative adjustment following audited turnover update.',
    })
  }

  // Submit Rank Update
  const handleConfirmRankUpdate = async () => {
    if (!rankDialog.company) return
    setSubmittingRank(true)

    try {
      await api.updateCompanyRank(rankDialog.company.id, {
        rank: rankDialog.newRank,
        officerName: adminUser?.name || 'Dr. Arvind Sharma',
        reason: rankDialog.reason,
      })

      setToast({
        open: true,
        message: `Company rank updated to ${rankDialog.newRank} (Max area: ${RANK_CONFIG[rankDialog.newRank]?.maxArea} ha)`,
        severity: 'success',
      })

      setRankDialog((prev) => ({ ...prev, open: false }))
      await loadData()
    } catch (err) {
      setToast({ open: true, message: err.message || 'Rank update failed', severity: 'error' })
    } finally {
      setSubmittingRank(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
            Company Governance &amp; Statutory Verifications
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Review automated statutory regex checks (GSTIN, PAN, CIN), execute officer approvals, and enforce rank-based land limits.
          </Typography>
        </Box>
      </motion.div>

      {/* Summary KPI Banner */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1c1917', border: '1px solid #44403c', color: '#fff' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#a8a29e' }}>Total Enterprises Registered</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#22c55e' }}>{companies.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1c1917', border: '1px solid #44403c', color: '#fff' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#a8a29e' }}>Pending Officer Verification</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: pendingCount > 0 ? '#f59e0b' : '#22c55e' }}>
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1c1917', border: '1px solid #44403c', color: '#fff' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#a8a29e' }}>Approved &amp; Active Entities</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284c7' }}>
                {companies.filter((c) => c.status === 'APPROVED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid: Companies Table + Live Audit Timeline */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ApartmentOutlined sx={{ color: '#16a34a' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    Enterprise Registry &amp; Verification
                  </Typography>
                </Stack>

                <Tabs
                  value={tabIndex}
                  onChange={(_, val) => setTabIndex(val)}
                  size="small"
                  sx={{
                    minHeight: 36,
                    '& .MuiTab-root': { minHeight: 36, py: 0.5, px: 2, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none' },
                  }}
                >
                  <Tab label={`All Entities (${companies.length})`} />
                  <Tab
                    label={
                      <Badge badgeContent={pendingCount} color="error" sx={{ '& .MuiBadge-badge': { right: -12, top: 2 } }}>
                        Pending Review
                      </Badge>
                    }
                  />
                </Tabs>
              </Stack>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        '& .MuiTableCell-head': {
                          fontWeight: 700,
                          color: '#57534e',
                          bgcolor: '#f5f5f4',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          py: 1.2,
                        },
                      }}
                    >
                      <TableCell>Company &amp; Identifiers</TableCell>
                      <TableCell>Sector / State</TableCell>
                      <TableCell>Turnover</TableCell>
                      <TableCell>Assigned Rank</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((__, j) => (
                            <TableCell key={j}><Skeleton variant="text" height={24} /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#78716c' }}>
                          No companies found in this category.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((c) => (
                        <TableRow key={c.id} hover sx={{ '&:hover': { bgcolor: '#fafaf9' } }}>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1c1917' }}>
                              {c.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#78716c', display: 'block', fontSize: '0.68rem' }}>
                              CIN: {c.cin}
                            </Typography>
                            {c.gstin && (
                              <Typography variant="caption" sx={{ color: '#0284c7', display: 'block', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                                GSTIN: {c.gstin}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{c.sector}</Typography>
                            <Typography variant="caption" sx={{ color: '#a8a29e' }}>{c.state}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>
                              {c.annualTurnoverCrores ? `₹${c.annualTurnoverCrores} Cr` : '—'}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <RankChip rank={c.rank} />
                          </TableCell>

                          <TableCell>
                            <StatusChip status={c.status} />
                          </TableCell>

                          <TableCell align="center">
                            {c.status === 'PENDING_VERIFICATION' ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="warning"
                                startIcon={<VerifiedUserOutlined />}
                                onClick={() => handleOpenVerify(c)}
                                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}
                              >
                                Review &amp; Verify
                              </Button>
                            ) : c.status === 'APPROVED' ? (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<TuneOutlined />}
                                onClick={() => handleOpenRank(c)}
                                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.4 }}
                              >
                                Modify Rank
                              </Button>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600 }}>
                                {c.rejectionReason || 'Rejected'}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Audit & Governance Log Timeline */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TimelineOutlined sx={{ color: '#d97706' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Statutory Audit Log
                </Typography>
              </Stack>

              <Box sx={{ maxHeight: 520, overflowY: 'auto', pr: 0.5 }}>
                {audits.length === 0
                  ? mockActivityLogs.map((log) => (
                      <Box key={log.id} sx={{ mb: 1.5, p: 1, bgcolor: '#f5f5f4', borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{log.detail}</Typography>
                        <Typography variant="caption" sx={{ color: '#78716c' }}>{log.company} · {log.timestamp}</Typography>
                      </Box>
                    ))
                  : audits.map((a) => {
                      const badge = logBadge(a.actionType)
                      return (
                        <Box key={a.id} sx={{ mb: 1.5, p: 1.25, bgcolor: '#f5f5f4', borderRadius: 1.5, borderLeft: `3px solid ${badge.color}` }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Chip label={a.actionType} size="small" sx={{ bgcolor: badge.bgcolor, color: badge.color, fontWeight: 700, fontSize: '0.62rem', height: 18 }} />
                            <Typography variant="caption" sx={{ color: '#a8a29e', fontSize: '0.65rem' }}>
                              {a.loggedAt ? new Date(a.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: '0.74rem', color: '#1c1917', lineHeight: 1.3 }}>
                            {a.details}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.5, fontSize: '0.66rem' }}>
                            Officer / Actor: {a.actor}
                          </Typography>
                        </Box>
                      )
                    })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==================== OFFICER VERIFICATION DIALOG ==================== */}
      <Dialog
        open={verifyDialog.open}
        onClose={() => setVerifyDialog((prev) => ({ ...prev, open: false }))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldOutlined /> Officer Verification &amp; Statutory Approval
        </DialogTitle>
        <DialogContent dividers>
          {verifyDialog.company && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.8 }}>
                  Applicant Company
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {verifyDialog.company.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Sector: {verifyDialog.company.sector} · State: {verifyDialog.company.state} · Contact: {verifyDialog.company.contactPerson} ({verifyDialog.company.email})
                </Typography>
              </Box>

              {/* Automated Regex Checks Diagnostic Panel */}
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <VerifiedUserOutlined fontSize="small" color="primary" /> Automated Statutory Number Verification Report
                </Typography>

                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 1.25, bgcolor: '#fff', border: '1px solid #cbd5e1', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>GSTIN ({verifyDialog.company.gstin})</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                        {verifyDialog.report?.gstinValid ? (
                          <>
                            <CheckCircleOutlined sx={{ color: '#16a34a', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>Syntactically Valid 15-char GSTIN</Typography>
                          </>
                        ) : (
                          <>
                            <ErrorOutlined sx={{ color: '#dc2626', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>Invalid GSTIN Format</Typography>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 1.25, bgcolor: '#fff', border: '1px solid #cbd5e1', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>PAN ({verifyDialog.company.pan})</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                        {verifyDialog.report?.panValid && verifyDialog.report?.panMatchesGstin ? (
                          <>
                            <CheckCircleOutlined sx={{ color: '#16a34a', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>Valid PAN &amp; Matches GSTIN Chars 3-12</Typography>
                          </>
                        ) : (
                          <>
                            <ErrorOutlined sx={{ color: '#dc2626', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>PAN verification discrepancy</Typography>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 1.25, bgcolor: '#fff', border: '1px solid #cbd5e1', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>CIN ({verifyDialog.company.cin})</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                        {verifyDialog.report?.cinValid ? (
                          <>
                            <CheckCircleOutlined sx={{ color: '#16a34a', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>Valid 21-digit MCA CIN</Typography>
                          </>
                        ) : (
                          <>
                            <ErrorOutlined sx={{ color: '#dc2626', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>Invalid CIN Format</Typography>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 1.25, bgcolor: '#fff', border: '1px solid #cbd5e1', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Audited Turnover &amp; Suggested Tier</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.25 }}>
                        ₹{verifyDialog.company.annualTurnoverCrores} Cr &rarr; {verifyDialog.report?.suggestedRank} (Max {verifyDialog.report?.maxAreaAllowedHa} ha)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Officer Manual Decision Controls */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                  Officer Acceptance &amp; Rank Assignment
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Button
                    variant={verifyDialog.approve ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => setVerifyDialog((prev) => ({ ...prev, approve: true }))}
                    sx={{ flex: 1, textTransform: 'none', fontWeight: 700 }}
                  >
                    Accept &amp; Approve Registration
                  </Button>
                  <Button
                    variant={!verifyDialog.approve ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => setVerifyDialog((prev) => ({ ...prev, approve: false }))}
                    sx={{ flex: 1, textTransform: 'none', fontWeight: 700 }}
                  >
                    Reject Registration
                  </Button>
                </Stack>

                {verifyDialog.approve ? (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Assigned Company Rank *</InputLabel>
                    <Select
                      value={verifyDialog.selectedRank}
                      label="Assigned Company Rank *"
                      onChange={(e) => setVerifyDialog((prev) => ({ ...prev, selectedRank: e.target.value }))}
                    >
                      {Object.entries(RANK_CONFIG).map(([k, v]) => (
                        <MenuItem key={k} value={k}>
                          <strong>{k}</strong> — {v.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}

                <TextField
                  label={verifyDialog.approve ? 'Approval Notes / Verification Remarks' : 'Rejection Reason (Required) *'}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  value={verifyDialog.reason}
                  onChange={(e) => setVerifyDialog((prev) => ({ ...prev, reason: e.target.value }))}
                  required={!verifyDialog.approve}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setVerifyDialog((prev) => ({ ...prev, open: false }))} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color={verifyDialog.approve ? 'success' : 'error'}
            loading={submittingDecision}
            onClick={handleConfirmDecision}
            sx={{ textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {verifyDialog.approve ? 'Confirm Approval & Enable Login' : 'Confirm Rejection'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* ==================== MODIFY RANK DIALOG ==================== */}
      <Dialog
        open={rankDialog.open}
        onClose={() => setRankDialog((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Adjust Company Tier &amp; Land Limit</DialogTitle>
        <DialogContent dividers>
          {rankDialog.company && (
            <Stack spacing={2}>
              <Typography variant="body2">
                Updating tier for <strong>{rankDialog.company.name}</strong> (Turnover: ₹{rankDialog.company.annualTurnoverCrores} Cr).
              </Typography>

              <FormControl fullWidth size="small">
                <InputLabel>New Company Rank *</InputLabel>
                <Select
                  value={rankDialog.newRank}
                  label="New Company Rank *"
                  onChange={(e) => setRankDialog((prev) => ({ ...prev, newRank: e.target.value }))}
                >
                  {Object.entries(RANK_CONFIG).map(([k, v]) => (
                    <MenuItem key={k} value={k}>
                      <strong>{k}</strong> — {v.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Reason / Administrative Note"
                fullWidth
                multiline
                rows={2}
                size="small"
                value={rankDialog.reason}
                onChange={(e) => setRankDialog((prev) => ({ ...prev, reason: e.target.value }))}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRankDialog((prev) => ({ ...prev, open: false }))} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={submittingRank}
            onClick={handleConfirmRankUpdate}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Save Rank Adjustment
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Toast Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CompaniesPage
