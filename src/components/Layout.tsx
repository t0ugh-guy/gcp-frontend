'use client'

import React, { useState } from 'react'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Alert } from '@mui/material'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4]" style={{ minHeight: '100vh', backgroundColor: '#f0fdf4' }}>
      <div className="fixed top-0 left-0 right-0 z-30" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30 }}>
        <Navbar onMenuClick={handleMenuToggle} />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className="pt-16 min-h-screen w-full p-3 sm:p-4 md:p-6 bg-[#f0fdf4]"
        style={{ paddingTop: 64, minHeight: '100vh', width: '100%', backgroundColor: '#f0fdf4', padding: '12px' }}
      >
        <Alert
          icon={<InfoOutlined sx={{ color: '#16a34a' }} />}
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 0,
            fontSize: '0.82rem',
            backgroundColor: '#dcfce7',
            color: '#14532d',
            border: '1px solid #bbf7d0',
            '& .MuiAlert-message': { py: 0.2 },
          }}
        >
          Prototype demonstration — Green Credit Programme under the Environment
          (Protection) Act, 1986
        </Alert>

        {children}
      </main>
    </div>
  )
}
