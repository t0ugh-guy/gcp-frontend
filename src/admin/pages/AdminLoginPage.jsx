import EnergySavingsLeaf from '@mui/icons-material/EnergySavingsLeaf'
import KeyOutlined from '@mui/icons-material/KeyOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Alert,
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { ADMIN_CREDENTIALS } from '../data/adminData'
import emblem from '../../assets/emblem.png'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { adminUser, adminLogin } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  if (adminUser) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await adminLogin(username.trim(), password)
    if (res && res.success) {
      navigate('/admin/dashboard', { replace: true })
      return
    }
    setError(res?.error || 'Invalid admin credentials. Access restricted.')
    setLoading(false)
  }

  const handleCopy = async (val) => {
    try { await navigator.clipboard.writeText(val); setSnackbarOpen(true) } catch { /* empty */ }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 6,
        background: 'linear-gradient(135deg, #1c1917 0%, #292524 45%, #44403c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            'linear-gradient(rgba(245,158,11,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Glow orb */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <Card
          sx={{
            maxWidth: 460,
            mx: 'auto',
            mt: '6vh',
            p: 4,
            position: 'relative',
            zIndex: 2,
            background: 'rgba(28,25,23,0.92) !important',
            backdropFilter: 'blur(20px) !important',
            border: '1px solid rgba(245,158,11,0.18)',
            borderRadius: 3,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            '&:hover': { transform: 'none', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', background: 'rgba(28,25,23,0.92) !important' },
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <Box
              component="img"
              src={emblem}
              alt="Government of India"
              sx={{ width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 }, filter: 'sepia(1) saturate(3) hue-rotate(5deg) brightness(0.9)', opacity: 0.88, objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.7rem' }}
          >
            Government of India
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', display: 'block', mb: 2, fontSize: '0.65rem' }}
          >
            Ministry of Environment, Forest and Climate Change
          </Typography>

          <Divider sx={{ borderColor: 'rgba(245,158,11,0.15)', mb: 3 }} />

          {/* Icon + Title */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 0 20px rgba(245,158,11,0.3)',
              }}
            >
              <ShieldOutlined sx={{ color: '#1c1917', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fef3c7', mb: 0.5 }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mb: 0.5, fontSize: '0.82rem' }}>
              Green Credit Programme — Regulatory Access
            </Typography>
            <Chip label="RESTRICTED ACCESS" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 700, fontSize: '0.62rem', height: 18 }} />
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fef3c7',
                  '& fieldset': { borderColor: 'rgba(245,158,11,0.25)' },
                  '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  color: '#fef3c7',
                  '& fieldset': { borderColor: 'rgba(245,158,11,0.25)' },
                  '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: '#1c1917',
                fontWeight: 700,
                fontSize: '0.9rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b45309, #d97706)',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
                },
              }}
            >
              Access Admin Panel
            </LoadingButton>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Demo credentials */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 2,
              bgcolor: 'rgba(245,158,11,0.05)',
              borderColor: 'rgba(245,158,11,0.2)',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#fcd34d', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: '0.8rem' }}>
              <KeyOutlined fontSize="small" />
              Demo Admin Credentials
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Box
                onClick={() => handleCopy(ADMIN_CREDENTIALS.username)}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 0.25 }}>Username</Typography>
                <Typography sx={{ color: '#fef3c7', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                  {ADMIN_CREDENTIALS.username}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1 }} />
              <Box
                onClick={() => handleCopy(ADMIN_CREDENTIALS.password)}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 0.25 }}>Password</Typography>
                <Typography sx={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                  {ADMIN_CREDENTIALS.password}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, display: 'block' }}>
              Click to copy · For prototype demonstration only
            </Typography>
          </Paper>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Typography
              variant="caption"
              onClick={() => navigate('/login')}
              sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#f59e0b' } }}
            >
              ← Back to Company Portal
            </Typography>
          </Box>
        </Card>
      </motion.div>

      <Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>Copied!</Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminLoginPage
