'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Home,
  Eye,
  Calendar,
  IndianRupee,
  Loader2,
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { useStore } from '@/store'
import { formatPrice } from '@/lib/utils'

interface Property {
  id: string
  title: string
  propertyType: string
  listingType: string
  totalPrice: number
  areaSqft: number
  pricePerSqft: number
  city: string
  status: string
  isVerified: boolean
  createdAt: string
}

interface Stats {
  totalListings: number
  activeListings: number
  totalViews: number
  totalLeads: number
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useStore()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalLeads: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/seller')
      return
    }

    if (user && user.role !== 'PROMOTER' && user.role !== 'ADMIN') {
      router.push('/')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/properties?promoterId=' + user?.id)
        const data = await response.json()

        if (response.ok) {
          setProperties(data.properties || [])
          setStats({
            totalListings: data.properties?.length || 0,
            activeListings:
              data.properties?.filter(
                (p: Property) => p.status === 'ACTIVE'
              ).length || 0,
            totalViews: Math.floor(Math.random() * 1000), // Demo data
            totalLeads: Math.floor(Math.random() * 50), // Demo data
          })
        }
      } catch {
        // Handle error silently
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <CheckCircle className="h-3 w-3" /> Active
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            <Clock className="h-3 w-3" /> Pending
          </span>
        )
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            <IndianRupee className="h-3 w-3" /> Sold
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
            <XCircle className="h-3 w-3" /> {status}
          </span>
        )
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Seller Dashboard
              </h1>
              <p className="text-secondary-600">
                Welcome back, {user?.name}
              </p>
            </div>
            <Link
              href="/dashboard/seller/add-property"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Listings</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.totalListings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Active Listings</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.activeListings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Views</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.totalViews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Leads</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.totalLeads}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-secondary-900">
              Your Properties
            </h2>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <Home className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No properties listed yet
              </h3>
              <p className="text-secondary-600 mb-6">
                Start by adding your first property listing.
              </p>
              <Link
                href="/dashboard/seller/add-property"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Price/Sq.ft
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {property.title}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {property.propertyType} • {property.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-900">
                        {formatPrice(property.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-primary-600 font-medium">
                        {formatPrice(property.pricePerSqft)}/sqft
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-4">
                        {property.isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission Info */}
        <div className="mt-8 p-6 bg-primary-50 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 mb-1">
                Commission Structure
              </h3>
              <p className="text-primary-700 text-sm">
                Listing your property is FREE! We only charge a 2% commission when
                your property is successfully sold through our platform. This ensures
                we&apos;re aligned with your success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
