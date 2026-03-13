'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { Network, Users, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="container-custom px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with <span className="text-blue-600">Professionals</span> Worldwide
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build meaningful connections, share your insights, and grow your professional network with Prolink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn btn-primary px-8 py-3 text-lg flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn btn-outline px-8 py-3 text-lg">
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container-custom px-4 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Prolink?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Network className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Networking</h3>
              <p className="text-gray-600">
                Build authentic connections with professionals in your field and beyond
              </p>
            </div>

            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Zap className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Insights</h3>
              <p className="text-gray-600">
                Post updates, engage in conversations, and showcase your expertise
              </p>
            </div>

            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Users className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                Join a thriving community focused on growth, collaboration, and success
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom px-4 py-20 text-center bg-blue-600 rounded-2xl mx-4 my-20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Expand Your Network?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of professionals on Prolink today</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sign Up Now
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="container-custom px-4 text-center">
            <p>&copy; 2026 Prolink. All rights reserved. Connecting professionals worldwide.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
