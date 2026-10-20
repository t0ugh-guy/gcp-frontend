import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlined from '@mui/icons-material/ErrorOutlined'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowBack from '@mui/icons-material/ArrowBack'
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import emblem from '../assets/emblem.png'

const SECTORS = [
  'Energy',
  'IT Services',
  'Automotive',
  'Manufacturing',
  'Renewable Energy',
  'Chemicals',
  'Mining & Metals',
  'Infrastructure',
  'Agriculture & Forestry',
  'Other',
]

const STATES = [
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Rajasthan',
  'Madhya Pradesh',
  'West Bengal',
  'Uttarakhand',
  'Odisha',
  'Telangana',
  'Uttar Pradesh',
  'Delhi',
  'Other',
]

// Regex definitions
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/

function getRankFromTurnover(turnover) {
  const val = parseFloat(turnover) || 0
  if (val >= 500) {
    return {
      rank: 'PLATINUM',
      maxArea: 50.0,
      color: '#0284c7',
      bg: '#e0f2fe',
      title: 'Tier 1 Enterprise (> ₹500 Cr)',
      desc: 'Eligible for large regional restoration parcels up to 50.0 hectares.',
    }
  } else if (val >= 100) {
    return {
      rank: 'GOLD',
      maxArea: 25.0,
      color: '#d97706',
      bg: '#fef3c7',
      title: 'Tier 2 Mid Enterprise (₹100 - ₹500 Cr)',
      desc: 'Eligible for medium forest buffer parcels up to 25.0 hectares.',
    }
  } else if (val >= 20) {
    return {
      rank: 'SILVER',
      maxArea: 15.0,
      color: '#64748b',
      bg: '#f1f5f9',
      title: 'Tier 3 Small Enterprise (₹20 - ₹100 Cr)',
      desc: 'Eligible for standard degraded parcels up to 15.0 hectares.',
    }
  } else {
    return {
      rank: 'BRONZE',
      maxArea: 5.0,
      color: '#b45309',
      bg: '#ffedd5',
      title: 'Tier 4 Micro / Startup (< ₹20 Cr)',
      desc: 'Eligible for community/micro restoration parcels up to 5.0 hectares.',
    }
  }
}

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    sector: 'Energy',
    state: 'Maharashtra',
    cin: '',
    gstin: '',
    pan: '',
    annualTurnoverCrores: '',
    contactPerson: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Real-time validations
  const cinValid = useMemo(() => {
    if (!formData.cin) return null
    return CIN_REGEX.test(formData.cin.trim().toUpperCase())
  }, [formData.cin])

  const gstinValid = useMemo(() => {
    if (!formData.gstin) return null
    return GSTIN_REGEX.test(formData.gstin.trim().toUpperCase())
  }, [formData.gstin])

  const panValid = useMemo(() => {
    if (!formData.pan) return null
    return PAN_REGEX.test(formData.pan.trim().toUpperCase())
  }, [formData.pan])

  const panMatchesGstin = useMemo(() => {
    if (!formData.gstin || !formData.pan) return null
    const cleanGstin = formData.gstin.trim().toUpperCase()
    const cleanPan = formData.pan.trim().toUpperCase()
    if (cleanGstin.length >= 12 && cleanPan.length === 10) {
      return cleanGstin.substring(2, 12) === cleanPan
    }
    return false
  }, [formData.gstin, formData.pan])

  const rankInfo = useMemo(() => {
    return getRankFromTurnover(formData.annualTurnoverCrores)
  }, [formData.annualTurnoverCrores])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client checks
    if (!formData.name.trim()) return setError('Please enter company name.')
    if (cinValid === false) return setError('Invalid CIN format (21 characters, e.g. L12345MH1919PLC000001).')
    if (gstinValid === false) return setError('Invalid GSTIN format (15 characters, e.g. 27AAACT2727Q1ZB).')
    if (panValid === false) return setError('Invalid PAN format (10 characters, e.g. AAACT2727Q).')
    if (panMatchesGstin === false) return setError('PAN does not match characters 3 to 12 of your GSTIN.')
    if (!formData.annualTurnoverCrores || parseFloat(formData.annualTurnoverCrores) < 0) {
      return setError('Please enter a valid annual turnover in ₹ Crores.')
    }
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.')
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.')

    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        sector: formData.sector,
        state: formData.state,
        cin: formData.cin.trim().toUpperCase(),
        gstin: formData.gstin.trim().toUpperCase(),
        pan: formData.pan.trim().toUpperCase(),
        annualTurnoverCrores: parseFloat(formData.annualTurnoverCrores),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        username: formData.username.trim(),
        password: formData.password,
      }

      const res = await api.registerCompany(payload)
      setSuccess(res)
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 4,
        background: 'linear-gradient(135deg, #0f391e 0%, #14532d 40%, #166534 80%, #15803d 100%)',
      }}
    >
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>
        {/* Header link back */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Button
            component={Link}
            to="/login"
            startIcon={<ArrowBack />}
            sx={{ color: '#bbf7d0', textTransform: 'none', fontWeight: 600 }}
          >
            Back to Portal Login
          </Button>
          <Chip
            icon={<ShieldOutlined sx={{ color: '#86efac !important' }} />}
            label="MoEFCC Statutory Verification Portal"
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#dcfce7', fontWeight: 600 }}
          />
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
          {/* Header Banner */}
          <Box
            sx={{
              background: 'linear-gradient(90deg, #14532d 0%, #166534 100%)',
              color: '#fff',
              px: { xs: 3, sm: 4 },
              py: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={emblem}
                alt="Emblem of India"
                sx={{ height: 50, filter: 'brightness(0) invert(1)', opacity: 0.95 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  Green Credit Programme (GCP)
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbf7d0', fontSize: '0.85rem' }}>
                  Company Registration & Statutory Credential Verification
                </Typography>
              </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <CheckCircleOutlined sx={{ fontSize: 72, color: '#16a34a', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#14532d', mb: 1 }}>
                    Registration Submitted Successfully!
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#374151', maxWidth: 600, mx: 'auto', mb: 3 }}>
                    Automated checks on <strong>GSTIN ({success.gstin})</strong> and <strong>CIN ({success.cin})</strong> passed.
                    Your provisional rank has been calculated as <strong>{success.rank}</strong> (Permitted Parcel Limit: Up to {getRankFromTurnover(success.annualTurnoverCrores).maxArea} ha).
                  </Typography>

                  <Paper sx={{ p: 2.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, mb: 3, textAlign: 'left', maxWidth: 540, mx: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
                      Next Steps (Officer Verification):
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e3a2b', mb: 1 }}>
                      • Your application reference ID: <strong>GCP-REG-{success.id}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e3a2b', mb: 1 }}>
                      • Status: <Chip label={success.status} size="small" color="warning" sx={{ fontWeight: 700 }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e3a2b' }}>
                      • The Regional Nodal Officer (ICFRE / MoEFCC) will review the statutory documents. Once approved, your login username <strong>{success.username}</strong> will be active to apply for land parcels.
                    </Typography>
                  </Paper>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                      bgcolor: '#16a34a',
                      '&:hover': { bgcolor: '#15803d' },
                      fontWeight: 700,
                      px: 4,
                      py: 1.2,
                    }}
                  >
                    Proceed to Login Page
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Stack spacing={3.5}>
                  {/* Section 1: Corporate Profile */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#14532d', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AccountBalanceOutlined fontSize="small" /> 1. Company Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          label="Company Legal Name *"
                          name="name"
                          fullWidth
                          size="small"
                          placeholder="e.g. Acme Green Technologies Pvt Ltd"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Industry Sector *</InputLabel>
                          <Select
                            name="sector"
                            value={formData.sector}
                            label="Industry Sector *"
                            onChange={handleChange}
                          >
                            {SECTORS.map((sec) => (
                              <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Registered State *</InputLabel>
                          <Select
                            name="state"
                            value={formData.state}
                            label="Registered State *"
                            onChange={handleChange}
                          >
                            {STATES.map((st) => (
                              <MenuItem key={st} value={st}>{st}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Annual Audited Turnover (₹ in Crores) *"
                          name="annualTurnoverCrores"
                          type="number"
                          fullWidth
                          size="small"
                          placeholder="e.g. 150.0"
                          value={formData.annualTurnoverCrores}
                          onChange={handleChange}
                          required
                          helperText="Determines statutory tier rank & maximum parcel area limit"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Dynamic Rank Card Preview */}
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: rankInfo.bg,
                      border: `1.5px solid ${rankInfo.color}`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={`Rank: ${rankInfo.rank}`}
                            sx={{ bgcolor: rankInfo.color, color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}
                            size="small"
                          />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {rankInfo.title}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                          {rankInfo.desc}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Max Parcel Area: ${rankInfo.maxArea} ha`}
                        variant="outlined"
                        sx={{ borderColor: rankInfo.color, color: rankInfo.color, fontWeight: 700, bgcolor: '#ffffffcc' }}
                      />
                    </Stack>
                  </Paper>

                  <Divider />

                  {/* Section 2: Statutory Numbers & Automated Checks */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#14532d', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <VerifiedUserOutlined fontSize="small" /> 2. Statutory Identifiers (Automated Verification)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                      GSTIN, PAN, and CIN are checked against regex standards and cross-validated for matching PAN credentials.
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="CIN Number *"
                          name="cin"
                          fullWidth
                          size="small"
                          placeholder="L12345MH1919PLC000001"
                          value={formData.cin}
                          onChange={handleChange}
                          required
                          error={cinValid === false}
                          helperText={
                            cinValid === false
                              ? 'Invalid CIN format'
                              : cinValid === true
                              ? '✓ Valid CIN format'
                              : '21-digit Corporate Identification No.'
                          }
                          FormHelperTextProps={{
                            sx: { color: cinValid === true ? '#16a34a' : undefined, fontWeight: 600 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="GSTIN Number *"
                          name="gstin"
                          fullWidth
                          size="small"
                          placeholder="27AAACT2727Q1ZB"
                          value={formData.gstin}
                          onChange={handleChange}
                          required
                          error={gstinValid === false}
                          helperText={
                            gstinValid === false
                              ? 'Invalid GSTIN format'
                              : gstinValid === true
                              ? '✓ Valid GSTIN format'
                              : '15-character GST identification'
                          }
                          FormHelperTextProps={{
                            sx: { color: gstinValid === true ? '#16a34a' : undefined, fontWeight: 600 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="PAN Number *"
                          name="pan"
                          fullWidth
                          size="small"
                          placeholder="AAACT2727Q"
                          value={formData.pan}
                          onChange={handleChange}
                          required
                          error={panValid === false}
                          helperText={
                            panValid === false
                              ? 'Invalid PAN format'
                              : panValid === true
                              ? panMatchesGstin === false
                                ? '⚠ PAN does not match GSTIN chars 3-12'
                                : '✓ Valid & matches GSTIN'
                              : '10-character Corporate PAN'
                          }
                          FormHelperTextProps={{
                            sx: {
                              color:
                                panValid === true && panMatchesGstin === true
                                  ? '#16a34a'
                                  : panMatchesGstin === false
                                  ? '#d97706'
                                  : undefined,
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Quick validation summary pills */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                      <Chip
                        size="small"
                        icon={gstinValid ? <CheckCircleOutlined /> : <ErrorOutlined />}
                        label={`GSTIN Regex: ${gstinValid === true ? 'Valid' : gstinValid === false ? 'Invalid' : 'Pending'}`}
                        color={gstinValid ? 'success' : gstinValid === false ? 'error' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={panValid ? <CheckCircleOutlined /> : <ErrorOutlined />}
                        label={`PAN Regex: ${panValid === true ? 'Valid' : panValid === false ? 'Invalid' : 'Pending'}`}
                        color={panValid ? 'success' : panValid === false ? 'error' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={panMatchesGstin ? <CheckCircleOutlined /> : <ErrorOutlined />}
                        label={`PAN in GSTIN: ${panMatchesGstin === true ? 'Matched' : panMatchesGstin === false ? 'Mismatch' : 'Pending'}`}
                        color={panMatchesGstin ? 'success' : panMatchesGstin === false ? 'error' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={cinValid ? <CheckCircleOutlined /> : <ErrorOutlined />}
                        label={`CIN Regex: ${cinValid === true ? 'Valid' : cinValid === false ? 'Invalid' : 'Pending'}`}
                        color={cinValid ? 'success' : cinValid === false ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Section 3: Contact Person */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#14532d', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PersonOutlined fontSize="small" /> 3. Designated Environmental / ESG Officer
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Contact Person Name *"
                          name="contactPerson"
                          fullWidth
                          size="small"
                          placeholder="e.g. Rohan Mehta"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Official Email *"
                          name="email"
                          type="email"
                          fullWidth
                          size="small"
                          placeholder="e.g. rohan.mehta@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Mobile / Phone *"
                          name="phone"
                          fullWidth
                          size="small"
                          placeholder="e.g. 9820011223"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider />

                  {/* Section 4: Login Credentials */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#14532d', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LockOutlined fontSize="small" /> 4. Create Portal Login
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Username *"
                          name="username"
                          fullWidth
                          size="small"
                          placeholder="e.g. acme_green"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Password *"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          size="small"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Confirm Password *"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          size="small"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                          helperText={
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? 'Passwords do not match'
                              : ''
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <strong>Verification Process Notice:</strong> Automated checks will validate GSTIN, PAN, and CIN on submit.
                    Final portal authorization is subject to the discretion of the MoEFCC / ICFRE Nodal Officer. You will be able to log in and apply for land parcels once verified.
                  </Alert>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={loading}
                    startIcon={<HowToRegOutlined />}
                    sx={{
                      bgcolor: '#16a34a',
                      '&:hover': { bgcolor: '#15803d' },
                      fontWeight: 800,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                    }}
                  >
                    Submit Company Registration for Verification
                  </LoadingButton>
                </Stack>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default RegisterPage

