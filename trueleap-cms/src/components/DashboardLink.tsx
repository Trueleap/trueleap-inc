'use client'
import React from 'react'
import { usePathname } from 'next/navigation.js'
import Link from 'next/link.js'

const DashboardLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin' || pathname === '/admin/'

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href="/admin"
      prefetch={false}
    >
      <span className="nav__link-label">Dashboard</span>
    </Link>
  )
}

export default DashboardLink
