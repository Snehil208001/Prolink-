'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { Mail, Briefcase, MapPin, Edit2 } from 'lucide-react'

interface Profile {
  id: number
  name: string
  email: string
  headline?: string
  location?: string
  bio?: string
}

export default function ProfilePage() {
  const { token } = useRouter()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [token, router])

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Profile not found</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container-custom max-w-3xl mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl h-32 mb-0"></div>

        {/* Profile Card */}
        <div className="card rounded-t-none rounded-b-2xl -mt-16 px-6 py-8 pt-20">
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
            <div className="text-6xl">👤</div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.headline || 'Professional'}</p>
                </div>
                <button className="btn btn-outline flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-gray-900 font-semibold">{profile.email}</p>
              </div>
            </div>

            {profile.location && (
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-gray-900 font-semibold">{profile.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Briefcase className="text-blue-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Headline</p>
                <p className="text-gray-900 font-semibold">{profile.headline || 'Add your headline'}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-gray-600 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-gray-600 text-sm">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-gray-600 text-sm">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
