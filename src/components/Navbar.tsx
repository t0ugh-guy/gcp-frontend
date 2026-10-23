'use client'

import React from 'react'
import BusinessCenter from '@mui/icons-material/BusinessCenter'
import EnergySavingsLeaf from '@mui/icons-material/EnergySavingsLeaf'
import LogoutIcon from '@mui/icons-material/Logout'
import { Menu } from 'lucide-react'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        height: 64,
        justifyContent: 'center',
        bgcolor: '#ffffff',
        color: '#14532d',
        borderBottom: '1px solid #dcfce7',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: 1.5, sm: 2.5 } }}>
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-3 w-9 h-9 flex items-center justify-center
            rounded-lg text-gray-500 hover:text-green-700
            hover:bg-green-50 transition-colors duration-150"
          aria-label="Open menu"
          style={{
            marginRight: 12,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem"
              sx={{ height: '36px', width: 'auto' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                lineHeight={1.2}
                letterSpacing={0.8}
                sx={{ textTransform: 'uppercase', opacity: 0.85 }}
              >
                Government of India
              </Typography>
              <Typography
                variant="caption"
                lineHeight={1.2}
                sx={{ opacity: 0.7, fontSize: '0.62rem' }}
              >
                Green Credit Programme
              </Typography>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1.5, borderColor: 'rgba(255,255,255,0.25)' }}
          />

          <IconButton
            disableRipple
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#16a34a',
              '&:hover': { bgcolor: '#15803d' },
            }}
          >
            <EnergySavingsLeaf sx={{ color: '#ffffff', fontSize: 20 }} />
          </IconButton>

          <Box>
            <Typography sx={{ fontWeight: 700, color: '#14532d', fontSize: '1.1rem', lineHeight: 1.1 }}>
              GreenCredit Portal
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.72rem', lineHeight: 1.2 }}>
              MoEFCC, Govt. of India
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          {currentUser && (
            <Chip
              icon={<BusinessCenter fontSize="small" />}
              label={`${currentUser.name} · ${currentUser.sector}`}
              color="success"
              variant="outlined"
              size="small"
              sx={{
                maxWidth: { xs: 170, md: '100%' },
                '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
              }}
            />
          )}
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
