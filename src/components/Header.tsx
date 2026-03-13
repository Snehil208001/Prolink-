'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LogOut, Home, Users, User } from 'lucide-react'

export default function Header() {
  const { token, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="container-custom flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Prolink
        </Link>

        {token ? (
          <div className="flex items-center gap-6">
            <Link href="/feed" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Home size={20} />
              <span>Feed</span>
            </Link>
            <Link href="/connections" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Users size={20} />
              <span>Connections</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
