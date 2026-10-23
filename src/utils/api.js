const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export function getCompanyToken() {
  return localStorage.getItem('gcp_token') || sessionStorage.getItem('gcp_token')
}

export function getAdminToken() {
  return localStorage.getItem('gcp_admin_token') || sessionStorage.getItem('gcp_admin_token')
}

export async function apiRequest(endpoint, options = {}, tokenType = 'company') {
  const token = tokenType === 'admin' ? getAdminToken() : getCompanyToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`
    try {
      const errJson = await response.json()
      errorMsg = errJson.message || errJson.error || errorMsg
    } catch {
      // not json
    }
    throw new Error(errorMsg)
  }

  // Check if 204 No Content
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  // Auth
  login: (username, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: (tokenType = 'company') =>
    apiRequest('/auth/me', { method: 'GET' }, tokenType),

  // Company Registration & Validation
  registerCompany: (data) =>
    apiRequest('/companies/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyStatutoryCheck: (cin, gstin, pan, annualTurnoverCrores) =>
    apiRequest('/companies/verify-check', {
      method: 'POST',
      body: JSON.stringify({ cin, gstin, pan, annualTurnoverCrores }),
    }),

  // Company details
  getCompany: (id) => apiRequest(`/companies/${id}`, { method: 'GET' }),
  getCompanyApplications: (id) => apiRequest(`/companies/${id}/applications`, { method: 'GET' }),
  getCompanyParcels: (id) => apiRequest(`/companies/${id}/parcels`, { method: 'GET' }),
  getCompanyCredits: (id) => apiRequest(`/companies/${id}/credits`, { method: 'GET' }),
  getCompanyLedger: (id) => apiRequest(`/companies/${id}/credits/ledger`, { method: 'GET' }),
  getCompanyRedemptions: (id) => apiRequest(`/companies/${id}/redemptions`, { method: 'GET' }),

  // Parcels
  getParcels: (params = '') => apiRequest(`/parcels${params ? '?' + params : ''}`, { method: 'GET' }),
  getParcel: (id) => apiRequest(`/parcels/${id}`, { method: 'GET' }),
  applyForParcel: (companyId, parcelId) =>
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({ companyId, parcelId }),
    }),

  // Redemptions
  getRedemptionOptions: () => apiRequest('/redemptions/options', { method: 'GET' }),
  requestRedemption: (companyId, option) =>
    apiRequest('/redemptions', {
      method: 'POST',
      body: JSON.stringify({ companyId, option }),
    }),

  // Admin Endpoints
  getAdminDashboardStats: () =>
    apiRequest('/admin/dashboard/stats', { method: 'GET' }, 'admin'),

  getAdminCompanies: (status) =>
    apiRequest(`/admin/companies${status ? '?status=' + status : ''}`, { method: 'GET' }, 'admin'),

  getAdminCompanyDetails: (id) =>
    apiRequest(`/admin/companies/${id}`, { method: 'GET' }, 'admin'),

  decideCompanyRegistration: (id, decision) =>
    apiRequest(`/admin/companies/${id}/decision`, {
      method: 'PUT',
      body: JSON.stringify(decision),
    }, 'admin'),

  updateCompanyRank: (id, rankData) =>
    apiRequest(`/admin/companies/${id}/rank`, {
      method: 'PUT',
      body: JSON.stringify(rankData),
    }, 'admin'),

  getAdminApplications: (status) =>
    apiRequest(`/admin/applications${status ? '?status=' + status : ''}`, { method: 'GET' }, 'admin'),

  decideApplication: (id, decision) =>
    apiRequest(`/admin/applications/${id}/decision`, {
      method: 'PUT',
      body: JSON.stringify(decision),
    }, 'admin'),

  getAdminCredits: (status) =>
    apiRequest(`/admin/credits${status ? '?status=' + status : ''}`, { method: 'GET' }, 'admin'),

  calculateCredits: (req) =>
    apiRequest('/admin/credits/calculate', {
      method: 'POST',
      body: JSON.stringify(req),
    }, 'admin'),

  decideCredits: (id, decision) =>
    apiRequest(`/admin/credits/${id}/decision`, {
      method: 'PUT',
      body: JSON.stringify(decision),
    }, 'admin'),

  getAdminParcels: () =>
    apiRequest('/admin/parcels', { method: 'GET' }, 'admin'),

  createParcel: (parcelData) =>
    apiRequest('/admin/parcels', {
      method: 'POST',
      body: JSON.stringify(parcelData),
    }, 'admin'),

  getAdminRedemptions: (status) =>
    apiRequest(`/admin/redemptions${status ? '?status=' + status : ''}`, { method: 'GET' }, 'admin'),

  decideRedemption: (id, decision) =>
    apiRequest(`/admin/redemptions/${id}/decision`, {
      method: 'PUT',
      body: JSON.stringify(decision),
    }, 'admin'),

  getAdminAudits: () =>
    apiRequest('/admin/audit', { method: 'GET' }, 'admin'),
}

