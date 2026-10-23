'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !currentUser) {
      router.replace('/login')
    }
  }, [mounted, currentUser, router])

  if (!mounted || !currentUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f0fdf4',
        }}
      >
        <CircularProgress sx={{ color: '#16a34a' }} />
      </Box>
    )
  }

  return <>{children}</>
}
