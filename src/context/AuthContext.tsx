'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { companies as mockCompanies } from '../data/companies'
import { AuthUser, CreditAccount } from '../types'

interface AuthContextType {
  currentUser: AuthUser | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [_isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gcp_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch {
      // Ignore parse/storage errors
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Synchronize and enrich user data from backend
  const enrichUserData = useCallback(async (authRes: any): Promise<AuthUser> => {
    const company = authRes.company || {}
    const companyId = authRes.companyId

    let allocatedParcels: any[] = []
    let applications: any[] = []
    let creditsData = { earned: 0, redeemed: 0, available: 0, inPipeline: 0 }
    let ledger: any[] = []
    let redemptions: any[] = []

    try {
      if (companyId) {
        const [p, a, c, l, r] = await Promise.allSettled([
          api.getCompanyParcels(companyId),
          api.getCompanyApplications(companyId),
          api.getCompanyCredits(companyId),
          api.getCompanyLedger(companyId),
          api.getCompanyRedemptions(companyId),
        ])

        if (p.status === 'fulfilled' && p.value) {
          allocatedParcels = p.value.map((parcel: any) => ({
            id: parcel.id,
            location: parcel.location || `${parcel.state} Restoration Zone`,
            area: parcel.areaHectares ?? parcel.area,
            state: parcel.state,
            lat: parcel.latitude ?? parcel.lat,
            lng: parcel.longitude ?? parcel.lng,
            status: parcel.status === 'ALLOTTED' ? 'Active' : parcel.status,
            allottedOn: parcel.allotmentDate || 'Recent',
          }))
        }

        if (a.status === 'fulfilled' && a.value) {
          applications = a.value
        }

        if (c.status === 'fulfilled' && c.value) {
          creditsData = {
            earned: c.value.totalEarned || 0,
            redeemed: c.value.redeemed || 0,
            available: c.value.available || 0,
            inPipeline: c.value.inPipeline || 0,
          }
        }

        if (l.status === 'fulfilled' && l.value) {
          ledger = l.value
        }

        if (r.status === 'fulfilled' && r.value) {
          redemptions = r.value
        }
      }
    } catch (e) {
      console.warn('Could not fetch all company sub-resources from backend, using fallbacks', e)
    }

    // Match with mock data if needed for UI widgets
    const matchedMock = mockCompanies.find(
      (m) =>
        m.CIN === company.cin ||
        m.name?.toLowerCase() === company.name?.toLowerCase() ||
        m.id === (company.username || '').replace('_power', '').replace('_ltd', '')
    )

    const pendingParcels = applications
      .filter((app: any) => app.status === 'PENDING_REVIEW')
      .map((app: any) => ({
        id: app.parcelId,
        location: `Pending Verification Parcel`,
        area: 10.0,
        state: company.state || 'India',
        appliedOn: app.submittedAt
          ? new Date(app.submittedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'Recent',
      }))

    const finalAllocated = allocatedParcels.length > 0 ? allocatedParcels : matchedMock?.allocatedParcels || []
    const rawPending = pendingParcels.length > 0 ? pendingParcels : matchedMock?.pendingParcels || []
    const finalPending = rawPending.map((p: any) => ({
      id: String(p.id),
      location: String(p.location || 'Pending Zone'),
      area: Number(p.area || 0),
      state: String(p.state || 'India'),
      appliedOn: String(p.appliedOn || 'Recent'),
    }))

    const rawCredits =
      creditsData.earned > 0 || creditsData.redeemed > 0 ? creditsData : matchedMock?.credits || creditsData
    const finalCredits: CreditAccount = {
      earned: rawCredits.earned || 0,
      redeemed: rawCredits.redeemed || 0,
      available: (rawCredits as any).available ?? Math.max(0, (rawCredits.earned || 0) - (rawCredits.redeemed || 0)),
      inPipeline: rawCredits.inPipeline || 0,
    }
    const finalLedger = ledger.length > 0 ? ledger : matchedMock?.ledger || []
    const finalRedemptionHistory = redemptions.length > 0 ? redemptions : matchedMock?.redemptionHistory || []

    const enriched: AuthUser = {
      id: company.id || authRes.companyId,
      name: company.name || authRes.fullName || 'Registered Company',
      CIN: company.cin,
      cin: company.cin,
      gstin: company.gstin,
      pan: company.pan,
      sector: company.sector || 'Industry',
      state: company.state || 'India',
      contactPerson: company.contactPerson || authRes.fullName,
      email: company.email,
      phone: company.phone,
      annualTurnoverCrores: company.annualTurnoverCrores,
      rank: company.rank || 'SILVER',
      status: company.status || 'APPROVED',
      registeredOn: company.registeredAt
        ? new Date(company.registeredAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : '2024',
      token: authRes.token,
      credentials: { username: authRes.username },
      allocatedParcels: finalAllocated,
      pendingParcels: finalPending,
      credits: finalCredits,
      ledger: finalLedger,
      redemptionHistory: finalRedemptionHistory,
    }

    return enriched
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const authRes = await api.login(username, password)

        if (authRes.role !== 'ROLE_COMPANY') {
          throw new Error('Access denied. This portal is for company users only.')
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('gcp_token', authRes.token)
        }

        const enriched = await enrichUserData(authRes)
        if (typeof window !== 'undefined') {
          localStorage.setItem('gcp_user', JSON.stringify(enriched))
        }
        setCurrentUser(enriched)
        return { success: true }
      } catch (err: any) {
        const errorMsg = err.message || 'Invalid credentials'
        return { success: false, error: errorMsg }
      }
    },
    [enrichUserData]
  )

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gcp_token')
      localStorage.removeItem('gcp_user')
    }
    setCurrentUser(null)
  }, [])

  const refreshUserData = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const me = await api.getMe('company')
      if (me && me.company) {
        const enriched = await enrichUserData(me)
        if (typeof window !== 'undefined') {
          localStorage.setItem('gcp_user', JSON.stringify(enriched))
        }
        setCurrentUser(enriched)
      }
    } catch (e) {
      console.warn('Could not refresh user data', e)
    }
  }, [currentUser?.id, enrichUserData])

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      refreshUserData,
    }),
    [currentUser, login, logout, refreshUserData]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
