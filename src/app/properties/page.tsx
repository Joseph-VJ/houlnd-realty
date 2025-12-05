'use client'

import { useState, useEffect, useCallback } from 'react'
import PropertyFilters from '@/components/properties/PropertyFilters'
import PropertyCard from '@/components/properties/PropertyCard'
import { Loader2, Search, SlidersHorizontal } from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  listingType: string
  totalPrice: number
  areaSqft: number
  pricePerSqft: number
  bedrooms?: number
  bathrooms?: number
  address: string
  city: string
  state: string
  pincode: string
  images: string[]
  amenities: string[]
  isVerified: boolean
  createdAt: string
}

interface Filters {
  propertyType: string
  listingType: string
  minPricePerSqft: string
  maxPricePerSqft: string
  minTotalPrice: string
  maxTotalPrice: string
  minArea: string
  maxArea: string
  city: string
  bedrooms: string
  sortBy: string
  sortOrder: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    propertyType: '',
    listingType: '',
    minPricePerSqft: '',
    maxPricePerSqft: '',
    minTotalPrice: '',
    maxTotalPrice: '',
    minArea: '',
    maxArea: '',
    city: '',
    bedrooms: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/properties?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties')
      }

      setProperties(data.properties || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      propertyType: '',
      listingType: '',
      minPricePerSqft: '',
      maxPricePerSqft: '',
      minTotalPrice: '',
      maxTotalPrice: '',
      minArea: '',
      maxArea: '',
      city: '',
      bedrooms: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && !['sortBy', 'sortOrder'].includes(key)
  ).length

  return (
    <div className="pt-16 min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Browse Properties
              </h1>
              <p className="text-secondary-600">
                {loading
                  ? 'Loading...'
                  : `${properties.length} properties found`}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-80 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-24">
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No properties found
                </h3>
                <p className="text-secondary-600 mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-outline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
