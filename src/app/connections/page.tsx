'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { UserPlus, UserCheck } from 'lucide-react'

interface Connection {
  id: number
  name: string
  headline: string
  avatar: string
  connected: boolean
}

export default function ConnectionsPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      headline: 'Product Manager at Tech Corp',
      avatar: '👩‍💼',
      connected: true,
    },
    {
      id: 2,
      name: 'Mike Chen',
      headline: 'Full Stack Developer',
      avatar: '👨‍💻',
      connected: true,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      headline: 'UX Designer at Design Studio',
      avatar: '👩‍🎨',
      connected: false,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  const toggleConnection = (id: number) => {
    setConnections(
      connections.map((conn) =>
        conn.id === id ? { ...conn, connected: !conn.connected } : conn
      )
    )
  }

  if (!token) return null

  return (
    <>
      <Header />
      <div className="container-custom max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Connections</h1>

        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{connection.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{connection.name}</h3>
                    <p className="text-gray-600">{connection.headline}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnection(connection.id)}
                  className={`btn flex items-center gap-2 ${
                    connection.connected ? 'btn-outline' : 'btn-primary'
                  }`}
                >
                  {connection.connected ? (
                    <>
                      <UserCheck size={18} />
                      Connected
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {connections.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg">No connections yet. Start connecting with professionals!</p>
          </div>
        )}
      </div>
    </>
  )
}
