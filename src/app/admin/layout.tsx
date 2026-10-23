import React from 'react'
import { AdminAuthProvider } from '@/admin/context/AdminAuthContext'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
