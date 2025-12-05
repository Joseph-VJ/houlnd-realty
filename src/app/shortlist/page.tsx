'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Loader2, Search, Trash2 } from 'lucide-react'
import { useStore } from '@/store'
import PropertyCard from '@/components/properties/PropertyCard'

interface ShortlistItem {
  id: string
  property: {
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
  createdAt: string
}

export default function ShortlistPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, addToast } = useStore()
  
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/shortlist')
      return
    }

    const fetchShortlist = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shortlist')
        const data = await response.json()

        if (response.ok) {
          setShortlist(data.shortlist || [])
        }
      } catch {
        addToast('Failed to load shortlist', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchShortlist()
    }
  }, [user, authLoading, router, addToast])

  const handleRemove = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/shortlist?propertyId=${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShortlist((prev) =>
          prev.filter((item) => item.property.id !== propertyId)
        )
        addToast('Removed from shortlist', 'success')
      }
    } catch {
      addToast('Failed to remove from shortlist', 'error')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                My Shortlist
              </h1>
              <p className="text-secondary-600">
                {shortlist.length} properties saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shortlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Your shortlist is empty
            </h3>
            <p className="text-secondary-600 mb-6">
              Start browsing properties and save your favorites here.
            </p>
            <Link href="/properties" className="btn-primary inline-flex items-center gap-2">
              <Search className="h-5 w-5" />
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.map((item) => (
              <div key={item.id} className="relative group">
                <PropertyCard property={item.property} />
                <button
                  onClick={() => handleRemove(item.property.id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                  title="Remove from shortlist"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
