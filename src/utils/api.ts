import {
  AdminStats,
  Company,
  CompanyStatus,
  CompanyVerificationResult,
  CreditAccount,
  CreditEntry,
  CreditLedgerEntry,
  LandApplication,
  LandParcel,
  RedemptionOptionType,
  RedemptionRecord,
} from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  'http://localhost:8080/api'

export function getCompanyToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gcp_token') || sessionStorage.getItem('gcp_token')
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gcp_admin_token') || sessionStorage.getItem('gcp_admin_token')
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  tokenType: 'company' | 'admin' = 'company',
): Promise<T> {
  const token = tokenType === 'admin' ? getAdminToken() : getCompanyToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
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

  if (response.status === 204) return null as T
  return response.json()
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: (tokenType: 'company' | 'admin' = 'company') =>
    apiRequest('/auth/me', { method: 'GET' }, tokenType),

  // Company Registration & Validation
  registerCompany: (data: any) =>
    apiRequest<Company>('/companies/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyStatutoryCheck: (
    cin: string,
    gstin: string,
    pan: string,
    annualTurnoverCrores?: number,
  ) =>
    apiRequest<CompanyVerificationResult>('/companies/verify-check', {
      method: 'POST',
      body: JSON.stringify({ cin, gstin, pan, annualTurnoverCrores }),
    }),

  // Company details
  getCompany: (id: number | string) =>
    apiRequest<Company>(`/companies/${id}`, { method: 'GET' }),
  getCompanyApplications: (id: number | string) =>
    apiRequest<LandApplication[]>(`/companies/${id}/applications`, { method: 'GET' }),
  getCompanyParcels: (id: number | string) =>
    apiRequest<LandParcel[]>(`/companies/${id}/parcels`, { method: 'GET' }),
  getCompanyCredits: (id: number | string) =>
    apiRequest<CreditAccount>(`/companies/${id}/credits`, { method: 'GET' }),
  getCompanyLedger: (id: number | string) =>
    apiRequest<CreditLedgerEntry[]>(`/companies/${id}/credits/ledger`, { method: 'GET' }),
  getCompanyRedemptions: (id: number | string) =>
    apiRequest<RedemptionRecord[]>(`/companies/${id}/redemptions`, { method: 'GET' }),

  // Parcels
  getParcels: (params = '') =>
    apiRequest<LandParcel[]>(`/parcels${params ? '?' + params : ''}`, { method: 'GET' }),
  getParcel: (id: string) =>
    apiRequest<LandParcel>(`/parcels/${id}`, { method: 'GET' }),
  applyForParcel: (companyId: number | string, parcelId: string) =>
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({ companyId, parcelId }),
    }),

  // Redemptions
  getRedemptionOptions: () =>
    apiRequest<Array<{ name: string; cost: number; purpose: string }>>('/redemptions/options', {
      method: 'GET',
    }),
  requestRedemption: (companyId: number | string, option: RedemptionOptionType | string) =>
    apiRequest('/redemptions', {
      method: 'POST',
      body: JSON.stringify({ companyId, option }),
    }),

  // Admin Endpoints
  getAdminDashboardStats: () =>
    apiRequest<AdminStats>('/admin/dashboard/stats', { method: 'GET' }, 'admin'),

  getAdminCompanies: (status?: CompanyStatus | string) =>
    apiRequest<Company[]>(
      `/admin/companies${status ? '?status=' + status : ''}`,
      { method: 'GET' },
      'admin',
    ),

  getAdminCompanyDetails: (id: number | string) =>
    apiRequest<{ company: Company; verificationReport: CompanyVerificationResult }>(
      `/admin/companies/${id}`,
      { method: 'GET' },
      'admin',
    ),

  decideCompanyRegistration: (id: number | string, decision: any) =>
    apiRequest(
      `/admin/companies/${id}/decision`,
      {
        method: 'PUT',
        body: JSON.stringify(decision),
      },
      'admin',
    ),

  updateCompanyRank: (id: number | string, rankData: any) =>
    apiRequest(
      `/admin/companies/${id}/rank`,
      {
        method: 'PUT',
        body: JSON.stringify(rankData),
      },
      'admin',
    ),

  getAdminApplications: (status?: string) =>
    apiRequest<LandApplication[]>(
      `/admin/applications${status ? '?status=' + status : ''}`,
      { method: 'GET' },
      'admin',
    ),

  decideApplication: (id: number | string, decision: any) =>
    apiRequest(
      `/admin/applications/${id}/decision`,
      {
        method: 'PUT',
        body: JSON.stringify(decision),
      },
      'admin',
    ),

  getAdminCredits: (status?: string) =>
    apiRequest<any[]>(
      `/admin/credits${status ? '?status=' + status : ''}`,
      { method: 'GET' },
      'admin',
    ),

  calculateCredits: (req: any) =>
    apiRequest(
      '/admin/credits/calculate',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      'admin',
    ),

  decideCredits: (id: number | string, decision: any) =>
    apiRequest(
      `/admin/credits/${id}/decision`,
      {
        method: 'PUT',
        body: JSON.stringify(decision),
      },
      'admin',
    ),

  getAdminParcels: () =>
    apiRequest<LandParcel[]>('/admin/parcels', { method: 'GET' }, 'admin'),

  createParcel: (parcelData: any) =>
    apiRequest<LandParcel>(
      '/admin/parcels',
      {
        method: 'POST',
        body: JSON.stringify(parcelData),
      },
      'admin',
    ),

  getAdminRedemptions: (status?: string) =>
    apiRequest<RedemptionRecord[]>(
      `/admin/redemptions${status ? '?status=' + status : ''}`,
      { method: 'GET' },
      'admin',
    ),

  decideRedemption: (id: number | string, decision: any) =>
    apiRequest(
      `/admin/redemptions/${id}/decision`,
      {
        method: 'PUT',
        body: JSON.stringify(decision),
      },
      'admin',
    ),

  getAdminAudits: () =>
    apiRequest<any[]>('/admin/audit', { method: 'GET' }, 'admin'),
}
