'use client'

import React, { useState } from 'react'
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined'
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined'
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined'
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import MenuOutlined from '@mui/icons-material/MenuOutlined'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAdminAuth } from '../context/AdminAuthContext'

const DRAWER_WIDTH = 256

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/admin/applications', label: 'Applications', icon: AssignmentOutlined },
  { to: '/admin/verification', label: 'Verification', icon: FactCheckOutlined },
  { to: '/admin/credits', label: 'Credits', icon: AccountBalanceWalletOutlined },
  { to: '/admin/land', label: 'Land Overview', icon: ForestOutlined },
  { to: '/admin/companies', label: 'Companies', icon: ApartmentOutlined },
]

function SidebarContent({ onClose }: { onClose: () => void }) {
  const { adminUser, adminLogout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    adminLogout()
    router.replace('/admin/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: '64px' }}>
      {/* Officer Info */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.18)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
          <Avatar
            sx={{
              bgcolor: '#f59e0b',
              color: '#1c1917',
              fontWeight: 700,
              width: 36,
              height: 36,
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            {adminUser?.avatar || 'A'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: '#fef3c7',
                fontSize: '0.82rem',
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {adminUser?.name}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.66rem',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {adminUser?.role}
            </Typography>
          </Box>
        </Stack>
        <Chip
          label={adminUser?.region}
          size="small"
          sx={{
            bgcolor: 'rgba(245,158,11,0.18)',
            color: '#fcd34d',
            fontSize: '0.62rem',
            fontWeight: 600,
            height: 18,
            borderRadius: 1,
            maxWidth: '100%',
          }}
        />
      </Box>

      {/* Navigation */}
      <List sx={{ px: 0.5, py: 1.5, flexGrow: 1, overflowY: 'auto' }}>
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.to

          return (
            <ListItem key={link.to} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                component={Link}
                href={link.to}
                onClick={onClose}
                sx={{
                  mx: 0.5,
                  borderRadius: 1.5,
                  borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                  backgroundColor: isActive ? 'rgba(245,158,11,0.14)' : 'transparent',
                  color: isActive ? '#fef3c7' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.18s ease',
                  py: 0.9,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                  <Icon sx={{ fontSize: 19 }} />
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#f59e0b',
                      flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Footer */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            color: 'rgba(255,255,255,0.5)',
            '&:hover': { color: '#fca5a5', bgcolor: 'rgba(239,68,68,0.1)' },
            px: 1.5,
            py: 0.9,
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
            <LogoutOutlined sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: 500 }}
          />
        </ListItemButton>
        <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.62rem', mt: 0.75, pl: 1.5 }}>
          Green Credit Admin · v1.0-beta
        </Typography>
      </Box>
    </Box>
  )
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawerSx = {
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      borderRight: 'none',
      background: 'linear-gradient(180deg, #1c1917 0%, #292524 60%, #1c1917 100%)',
      color: '#ecfdf5',
      boxSizing: 'border-box',
    },
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f4' }}>
      {/* ── AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1c1917 0%, #292524 100%)',
          borderBottom: '1px solid rgba(245,158,11,0.18)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          {/* Hamburger — always visible on mobile */}
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen((p) => !p)}
            edge="start"
            sx={{ mr: 0.5, display: { md: 'none' } }}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <ChevronLeftOutlined sx={{ color: '#fcd34d' }} />
            ) : (
              <MenuOutlined sx={{ color: '#fcd34d' }} />
            )}
          </IconButton>

          {/* Emblem + Title */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              component="img"
              src="/assets/emblem.png"
              alt="Government of India Emblem"
              sx={{
                height: { xs: 32, sm: 40 },
                width: 'auto',
                filter: 'sepia(1) saturate(3) hue-rotate(5deg) brightness(0.9)',
                opacity: 0.9,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#fef3c7',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  fontSize: { xs: '0.78rem', sm: '0.88rem' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Government of India
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: { xs: '0.7rem', sm: '0.62rem' },
                  lineHeight: 1.2,
                  fontWeight: { xs: 600, sm: 400 },
                }}
              >
                {isMobile ? 'GCP Admin' : 'Green Credit Monitoring System'}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="ADMIN"
            size="small"
            sx={{
              ml: 0.5,
              bgcolor: 'rgba(245,158,11,0.2)',
              color: '#fcd34d',
              fontWeight: 700,
              fontSize: '0.6rem',
              height: 18,
              letterSpacing: 0.5,
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Admin Panel — Restricted Access">
            <Chip
              label="RESTRICTED"
              size="small"
              sx={{
                bgcolor: 'rgba(239,68,68,0.14)',
                color: '#fca5a5',
                fontWeight: 600,
                fontSize: '0.6rem',
                height: 18,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
          </Tooltip>

          <ShieldOutlined sx={{ color: '#f59e0b', fontSize: 18, ml: 0.5, display: { xs: 'flex', sm: 'none' } }} />
        </Toolbar>
      </AppBar>

      {/* ── Mobile Drawer (temporary) ── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          ...drawerSx,
          '& .MuiDrawer-paper': {
            ...drawerSx['& .MuiDrawer-paper'],
            transition: 'transform 0.25s ease',
          },
        }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </Drawer>

      {/* ── Desktop Drawer (permanent) ── */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          ...drawerSx,
        }}
      >
        <SidebarContent onClose={() => {}} />
      </Drawer>

      {/* ── Main Content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { xs: 0 },
          mt: { xs: '56px', sm: '64px' },
          p: { xs: 1.5, sm: 2.5, md: 3 },
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          backgroundColor: '#1c1917',
          backgroundImage: `url(/assets/satellite_texture.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          boxSizing: 'border-box',
        }}
      >
        {/* Admin Banner */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              mb: { xs: 2, sm: 2.5 },
              py: 0.75,
              px: { xs: 1.5, sm: 2 },
              borderRadius: 1.5,
              border: '1px solid rgba(245,158,11,0.22)',
              bgcolor: 'rgba(245,158,11,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <ShieldOutlined sx={{ color: '#d97706', fontSize: 14, flexShrink: 0 }} />
            <Typography
              variant="caption"
              sx={{ color: '#92400e', fontWeight: 600, fontSize: { xs: '0.68rem', sm: '0.72rem' } }}
            >
              Admin Monitoring System — Green Credit Programme · Environment (Protection) Act, 1986 · Prototype
            </Typography>
          </Box>
        </motion.div>

        {children}
      </Box>
    </Box>
  )
}
