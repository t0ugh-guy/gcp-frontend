import React from 'react'
import AdminProtectedRoute from '@/admin/components/AdminProtectedRoute'
import AdminLayout from '@/admin/layout/AdminLayout'

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminProtectedRoute>
  )
}
