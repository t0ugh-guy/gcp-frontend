import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined'
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined'
import ErrorOutlined from '@mui/icons-material/ErrorOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined'
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { companies } from '../../data/companies'
import {
  activityLogs,
  adminOfficer,
  creditApprovalRecords,
  pendingApplications,
  systemAlerts,
  verificationRecords,
} from '../data/adminData'

const MotionCard = motion(Card)

// ─── Derived stats ───────────────────────────────────────────────────────────
const totalCreditsIssued = companies.reduce((sum, c) => sum + c.credits.earned, 0)
const totalLand = companies.reduce(
  (sum, c) => sum + c.allocatedParcels.reduce((s, p) => s + p.area, 0),
  0,
)
const totalActiveProjects = companies.reduce((sum, c) => sum + c.allocatedParcels.length, 0)
const totalPendingParcels = companies.reduce((sum, c) => sum + c.pendingParcels.length, 0)
const flaggedProjects = verificationRecords.filter((v) => v.flagged).length
const pendingCredits = creditApprovalRecords.filter((c) => c.status === 'Pending Approval').length
const pendingVerifications = verificationRecords.filter(
  (v) => v.status !== 'Approved' && !v.flagged,
).length



const sectorData = [
  { name: 'Energy', value: 2 },
  { name: 'IT Services', value: 1 },
  { name: 'Manufacturing', value: 1 },
  { name: 'Automobile', value: 1 },
]
const SECTOR_COLORS = ['#16a34a', '#0284c7', '#d97706', '#7c3aed']

function alertSeverity(type) {
  if (type === 'warning') return 'warning'
  if (type === 'success') return 'success'
  if (type === 'error') return 'error'
  return 'info'
}

function severityDot(s) {
  const map = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#0284c7' }
  return map[s] || '#a8a29e'
}

import { useState, useEffect } from 'react'
import { api } from '../../utils/api'
import { useAdminAuth } from '../context/AdminAuthContext'

// ─── Component ────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const { adminUser } = useAdminAuth()
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    api.getAdminDashboardStats().then(setLiveStats).catch(() => {})
  }, [])

  const currentOfficer = adminUser || adminOfficer

  const dynamicPendingCards = [
    {
      label: 'Applications',
      value: liveStats ? liveStats.pendingApplications : pendingApplications.length,
      icon: AssignmentOutlined,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fcd34d',
    },
    {
      label: 'Company Verifications',
      value: liveStats ? liveStats.pendingCompanyVerifications : pendingVerifications,
      icon: FactCheckOutlined,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
    },
    {
      label: 'Credits in Queue',
      value: liveStats ? liveStats.pendingCreditApprovals : pendingCredits,
      icon: AccountBalanceWalletOutlined,
      color: '#7c3aed',
      bg: '#faf5ff',
      border: '#e9d5ff',
    },
    {
      label: 'Flagged Monitoring',
      value: flaggedProjects,
      icon: ErrorOutlined,
      color: '#dc2626',
      bg: '#fff5f5',
      border: '#fecaca',
    },
  ]

  const dynamicStatCards = [
    {
      label: 'Active Enterprises',
      value: liveStats ? liveStats.totalCompanies : totalActiveProjects,
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      icon: ForestOutlined,
    },
    {
      label: 'Credits Issued',
      value: liveStats ? liveStats.totalCreditsIssued.toLocaleString('en-IN') : totalCreditsIssued.toLocaleString('en-IN'),
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: TrendingUpOutlined,
    },
    {
      label: 'Land Allocated (ha)',
      value: liveStats ? `${liveStats.totalLandAllocatedHectares}` : `${totalLand.toFixed(1)}`,
      color: '#7c3aed',
      bg: '#faf5ff',
      border: '#e9d5ff',
      icon: ForestOutlined,
    },
    {
      label: 'Available Parcels',
      value: liveStats ? liveStats.totalAvailableParcels : totalPendingParcels,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fcd34d',
      icon: AssignmentOutlined,
    },
  ]

  return (
    <Box>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#d6d3d1', mt: 0.25, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            System overview — {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </Typography>
        </Box>
      </motion.div>

      {/* ── Officer Info ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <Card
          sx={{
            mb: { xs: 2, sm: 2.5 },
            background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(0,0,0,0.28)' },
          }}
        >
          <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 2.5 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Avatar sx={{ bgcolor: '#f59e0b', color: '#1c1917', width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 }, fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
                {currentOfficer.avatar || 'A'}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ color: '#fef3c7', fontWeight: 700, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                  {currentOfficer.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>
                  {currentOfficer.role} · {currentOfficer.employeeId}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.72rem', display: { xs: 'none', sm: 'block' } }}>
                  {currentOfficer.ministry}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                <Chip label={currentOfficer.region} size="small" sx={{ bgcolor: 'rgba(245,158,11,0.2)', color: '#fcd34d', fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                <Chip label="● Active" size="small" sx={{ bgcolor: 'rgba(34,197,94,0.15)', color: '#4ade80', fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Pending Action Cards ── */}
      <Typography variant="overline" sx={{ color: '#e5e7eb', fontWeight: 700, mb: 1.5, display: 'block', fontSize: '0.68rem', letterSpacing: 1 }}>
        Pending Actions
      </Typography>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 2.5, sm: 3 } }}>
        {dynamicPendingCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Grid item xs={12} sm={6} md={3} lg={3} key={card.label}>
              <MotionCard
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: `1px solid ${card.border}`,
                  bgcolor: card.bg,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 6px 20px ${card.color}22` },
                }}
              >
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: `${card.color}18`, color: card.color, mx: 'auto', mb: 0.75, width: { xs: 36, sm: 42 }, height: { xs: 36, sm: 42 } }}>
                    <Icon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  </Avatar>
                  <Typography sx={{ fontSize: { xs: '1.6rem', sm: '1.9rem' }, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.72rem' } }}>
                    {card.label}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          )
        })}
      </Grid>

      {/* ── System Statistics ── */}
      <Typography variant="overline" sx={{ color: '#e5e7eb', fontWeight: 700, mb: 1.5, display: 'block', fontSize: '0.68rem', letterSpacing: 1 }}>
        System Statistics
      </Typography>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 2.5, sm: 3 } }}>
        {dynamicStatCards.map((s, i) => {
          const Icon = s.icon
          return (
            <Grid item xs={12} sm={6} md={3} lg={3} key={s.label}>
              <MotionCard
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.12 + i * 0.06 }}
                sx={{ border: `1px solid ${s.border}`, bgcolor: s.bg, '&:hover': { transform: 'translateY(-2px)' } }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: `${s.color}20`, color: s.color, width: { xs: 40, sm: 46 }, height: { xs: 40, sm: 46 }, flexShrink: 0 }}>
                    <Icon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' }, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 500, fontSize: { xs: '0.66rem', sm: '0.72rem' } }}>
                      {s.label}
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          )
        })}
      </Grid>

      {/* ── Bottom Row: Alerts | Pie | Activity ── */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>

        {/* System Alerts */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <NotificationsActiveOutlined sx={{ color: '#d97706', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  System Alerts
                </Typography>
              </Stack>
              <Stack spacing={1.25}>
                {systemAlerts.map((alt) => (
                  <Alert
                    key={alt.id}
                    severity={alertSeverity(alt.type)}
                    sx={{ fontSize: '0.75rem', borderRadius: 2, alignItems: 'flex-start', py: 0.75 }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 0.2, lineHeight: 1.4 }}>
                      {alt.message}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.68rem' }}>
                      {alt.date}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sector Pie */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Companies by Sector
              </Typography>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sectorData.map((entry, idx) => (
                      <Cell key={`c-${idx}`} fill={SECTOR_COLORS[idx % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} co.`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={0.5} mt={0.5}>
                {sectorData.map((d, i) => (
                  <Stack key={d.name} direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: SECTOR_COLORS[i], flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: '#57534e', fontSize: '0.72rem' }}>
                      {d.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a8a29e', ml: 'auto', fontSize: '0.68rem' }}>
                      {d.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Recent Activity
              </Typography>
              <Box sx={{ maxHeight: { xs: 240, sm: 300 }, overflowY: 'auto', pr: 0.5 }}>
                {activityLogs.slice(0, 7).map((log, i) => (
                  <Box key={log.id}>
                    <Stack direction="row" spacing={1.25} py={0.9}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: severityDot(log.severity),
                          mt: 0.6,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#1c1917', lineHeight: 1.3 }}>
                          {log.type}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.68rem' }}>
                          {log.company}
                        </Typography>
                        <Typography sx={{ fontSize: '0.66rem', color: '#a8a29e', mt: 0.2 }}>
                          {log.timestamp}
                        </Typography>
                      </Box>
                    </Stack>
                    {i < 6 && <Divider sx={{ borderColor: '#f5f5f4' }} />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      
      {/* ── Dashboard Quick Actions ── */}
      <Typography variant="overline" sx={{ color: '#e5e7eb', fontWeight: 700, mb: 1.5, mt: 3, display: 'block', fontSize: '0.68rem', letterSpacing: 1 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {[
          { label: 'Pending Applications', icon: AssignmentOutlined, route: '/admin/applications', color: '#0284c7' },
          { label: 'Verify Restoration', icon: FactCheckOutlined, route: '/admin/verification', color: '#16a34a' },
          { label: 'Approve Credits', icon: AccountBalanceWalletOutlined, route: '/admin/credits', color: '#7c3aed' },
          { label: 'National Map', icon: ForestOutlined, route: '/admin/land', color: '#d97706' },
        ].map(action => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
             <Card sx={{ bgcolor: 'rgba(255,255,255,0.6)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)', transform: 'translateY(-2px)'} }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '16px !important' }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${action.color}15`, color: action.color, display: 'flex' }}>
                    <action.icon />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#1c1917', fontSize: '0.85rem' }}>{action.label}</Typography>
                </CardContent>
             </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default AdminDashboard
