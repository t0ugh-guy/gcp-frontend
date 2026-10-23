import type { Metadata } from 'next'
import '@fontsource/inter/index.css'
import '@/index.css'
import ThemeClientProvider from '@/components/ThemeClientProvider'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Green Credit Portal — MoEFCC, Government of India',
  description: 'National Portal for Green Credit Programme (GCP) — Land Allocation, Verification & Credit Generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <ThemeClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeClientProvider>
      </body>
    </html>
  )
}
