import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../../utils/api'
import { adminOfficer as mockOfficer } from '../data/adminData'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gcp_admin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const adminLogin = async (username, password) => {
    try {
      const authRes = await api.login(username, password)

      if (authRes.role !== 'ROLE_ADMIN') {
        throw new Error('Access denied. Administrator privileges required.')
      }

      localStorage.setItem('gcp_admin_token', authRes.token)

      const officer = {
        name: authRes.officer?.name || authRes.fullName || mockOfficer.name,
        role: authRes.officer?.role || mockOfficer.role,
        region: authRes.officer?.region || mockOfficer.region,
        employeeId: authRes.officer?.employeeId || mockOfficer.employeeId,
        ministry: authRes.officer?.ministry || mockOfficer.ministry,
        avatar: (authRes.fullName || 'A').charAt(0),
        username: authRes.username,
      }

      localStorage.setItem('gcp_admin_user', JSON.stringify(officer))
      setAdminUser(officer)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Invalid admin credentials' }
    }
  }

  const adminLogout = () => {
    localStorage.removeItem('gcp_admin_token')
    localStorage.removeItem('gcp_admin_user')
    setAdminUser(null)
  }

  const value = useMemo(
    () => ({ adminUser, adminLogin, adminLogout }),
    [adminUser],
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
