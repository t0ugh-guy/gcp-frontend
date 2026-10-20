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
  Button,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { companies } from '../data/companies'
import emblem from '../assets/emblem.png'

function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    await Promise.resolve()

    const result = await login(username.trim(), password)

    if (result && result.success) {
      navigate('/dashboard', { replace: true })
      return
    }

    setError(result?.error || 'Invalid credentials. Please try again.')
    setLoading(false)
  }

  const handleCopy = async (value) => {
    if (!navigator?.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setSnackbarOpen(true)
    } catch {
      setSnackbarOpen(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 6,
        background:
          'linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 70%, #16a34a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          background:
            'repeating-radial-gradient(circle at 15% 20%, rgba(255,255,255,0.3) 0 1px, transparent 1px 30px)',
          animation: 'drift-pattern 20s linear infinite',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 440, mx: 'auto', mt: '8vh', p: 4, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Box
              component="img"
              src={emblem}
              alt="Government of India Emblem"
              sx={{ width: { xs: 52, sm: 64 }, height: { xs: 52, sm: 64 }, objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 700, letterSpacing: 1, color: 'text.secondary', textTransform: 'uppercase' }}
          >
            Government of India
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', textAlign: 'center', display: 'block', mb: 2 }}
          >
            Ministry of Environment, Forest and Climate Change
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <EnergySavingsLeaf />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, color: '#14532d' }}>
              GreenCredit Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
              Ministry of Environment, Forest & Climate Change
            </Typography>

            <Divider sx={{ borderColor: '#bbf7d0', mb: 3 }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
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
              color="primary"
              fullWidth
              size="large"
              sx={{ mb: 1.5 }}
            >
              Login to Portal
            </LoadingButton>

            <Button
              onClick={() => navigate('/register')}
              variant="contained"
              fullWidth
              size="medium"
              sx={{
                mb: 1.5,
                bgcolor: '#059669',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                '&:hover': { bgcolor: '#047857' },
              }}
            >
              New Enterprise? Register with GSTIN / CIN
            </Button>

            <Button
              onClick={() => navigate('/admin/login')}
              variant="outlined"
              fullWidth
              size="medium"
              startIcon={<ShieldOutlined />}
              sx={{
                mb: 2,
                borderColor: '#d97706',
                color: '#d97706',
                fontWeight: 600,
                fontSize: '0.85rem',
                '&:hover': {
                  borderColor: '#b45309',
                  bgcolor: '#fffbeb',
                  boxShadow: '0 4px 12px rgba(217,119,6,0.15)',
                },
              }}
            >
              Admin Login
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, x: [-8, 8, -8, 8, 0] }}
                  exit={{ opacity: 0 }}
                >
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <Paper
            variant="outlined"
            sx={{ p: 2, mt: 3, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderRadius: 2 }}
          >
            <Typography variant="subtitle2" sx={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <KeyOutlined fontSize="small" />
              Demo Credentials
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => handleCopy(company.credentials.username)}
                    >
                      {company.credentials.username}
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: 'monospace', color: '#16a34a', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => handleCopy(company.credentials.password)}
                    >
                      {company.credentials.password}
                    </TableCell>
                    <TableCell>{company.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Card>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Copied!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LoginPage