'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import { Home, Menu, X, User, LogOut, Building, Heart, Calendar } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check auth status on mount
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [setUser, setLoading])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-900">
              Houlnd Realty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/properties"
              className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
            >
              Properties
            </Link>
            {user?.role === 'PROMOTER' && (
              <Link
                href="/dashboard/properties"
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                My Listings
              </Link>
            )}
            {user && (
              <>
                <Link
                  href="/shortlist"
                  className="text-secondary-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                >
                  <Heart className="h-4 w-4" />
                  Shortlist
                </Link>
                <Link
                  href="/appointments"
                  className="text-secondary-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'PROMOTER' && (
                  <Link href="/properties/new" className="btn-primary">
                    + Post Property
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-secondary-700 hover:bg-primary-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-secondary-700 hover:bg-primary-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-secondary-600 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-secondary-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="/properties"
                className="text-secondary-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              {user ? (
                <>
                  <Link
                    href="/shortlist"
                    className="text-secondary-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shortlist
                  </Link>
                  <Link
                    href="/appointments"
                    className="text-secondary-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-secondary-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'PROMOTER' && (
                    <Link
                      href="/properties/new"
                      className="btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      + Post Property
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-secondary-600 hover:text-primary-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-secondary-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
