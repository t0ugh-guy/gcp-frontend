'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../utils/api'
import { adminOfficer as mockOfficer } from '../data/adminData'
import { OfficerInfo } from '../../types'

interface AdminAuthContextType {
  adminUser: OfficerInfo | null
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<OfficerInfo | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gcp_admin_user')
      if (stored) {
        setAdminUser(JSON.parse(stored))
      }
    } catch {
      // Ignore parse/storage errors
    }
  }, [])

  const adminLogin = async (username: string, password: string) => {
    try {
      const authRes = await api.login(username, password)

      if (authRes.role !== 'ROLE_ADMIN') {
        throw new Error('Access denied. Administrator privileges required.')
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('gcp_admin_token', authRes.token)
      }

      const officer: OfficerInfo = {
        name: authRes.officer?.name || authRes.fullName || mockOfficer.name,
        role: authRes.officer?.role || mockOfficer.role,
        region: authRes.officer?.region || mockOfficer.region,
        employeeId: authRes.officer?.employeeId || mockOfficer.employeeId,
        ministry: authRes.officer?.ministry || mockOfficer.ministry,
        avatar: (authRes.fullName || 'A').charAt(0),
        username: authRes.username,
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('gcp_admin_user', JSON.stringify(officer))
      }
      setAdminUser(officer)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid admin credentials' }
    }
  }

  const adminLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gcp_admin_token')
      localStorage.removeItem('gcp_admin_user')
    }
    setAdminUser(null)
  }

  const value = useMemo(
    () => ({ adminUser, adminLogin, adminLogout }),
    [adminUser]
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
