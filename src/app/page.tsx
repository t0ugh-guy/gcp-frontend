'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const user = localStorage.getItem('gcp_user')
      if (user) {
        router.replace('/dashboard')
        return
      }
    } catch {
      // ignore
    }
    router.replace('/login')
  }, [router])

  return null
}
