'use client'

import React, { useState } from 'react'
import { BarChart2, Droplets, LayoutDashboard, Leaf, Map, Wallet, Wind } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

interface MenuItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  iconColor?: string
  isWip?: boolean
}

const menuItems: MenuItem[] = [
  { label: 'Company Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Land Allocation', icon: Map, path: '/land' },
  { label: 'AI Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'Credits Dashboard', icon: Wallet, path: '/credits' },
  {
    label: 'Water Credits',
    icon: Droplets,
    path: '/water',
    iconColor: 'text-blue-300',
    isWip: true,
  },
  {
    label: 'Air Credits',
    icon: Wind,
    path: '/air',
    iconColor: 'text-purple-300',
    isWip: true,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser } = useAuth()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 300ms ease',
  }

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    height: '100vh',
    width: 256,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #14532d 0%, #166534 50%, #15803d 100%)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 300ms ease-in-out',
  }

  const navButtonBaseStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 160ms ease',
  }

  const handleNav = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={overlayStyle}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64
          bg-gradient-to-b from-[#14532d] via-[#166534] to-[#15803d]
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={sidebarStyle}
      >
        <div className="flex items-center px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">GreenCredit Portal</p>
              <p className="text-white/50 text-xs">MoEFCC</p>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-white/10 border border-white/10">
            <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
            <p className="text-white/60 text-[11px] truncate mt-0.5">{currentUser.sector}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 mt-5 space-y-1.5">
          {menuItems.map(({ label, icon: Icon, path, iconColor, isWip }) => {
            const active = pathname === path
            const hovered = hoveredPath === path

            return (
              <button
                key={path}
                type="button"
                onClick={() => handleNav(path)}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-all duration-150
                  ${
                    active
                      ? 'bg-white/20 text-white border-l-4 border-green-300 pl-2'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                style={{
                  ...navButtonBaseStyle,
                  color: active ? '#ffffff' : hovered ? 'rgba(255,255,255,0.93)' : 'rgba(255,255,255,0.84)',
                  backgroundColor: active
                    ? 'rgba(255,255,255,0.2)'
                    : hovered
                    ? 'rgba(255,255,255,0.1)'
                    : 'transparent',
                  borderLeft: active ? '4px solid #86efac' : '4px solid transparent',
                  paddingLeft: active ? 8 : 12,
                }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-green-300' : iconColor ?? 'text-white/80'}`} />
                <span className="flex items-center">
                  {label}
                  {isWip && (
                    <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-200">
                      WIP
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
