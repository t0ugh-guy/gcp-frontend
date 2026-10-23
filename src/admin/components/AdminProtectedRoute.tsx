'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '../context/AdminAuthContext'
import { Box, CircularProgress } from '@mui/material'

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { adminUser } = useAdminAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !adminUser) {
      router.replace('/admin/login')
    }
  }, [mounted, adminUser, router])

  if (!mounted || !adminUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#1c1917',
        }}
      >
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    )
  }

  return <>{children}</>
}
