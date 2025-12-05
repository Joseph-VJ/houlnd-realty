'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  IndianRupee,
  Calendar,
  Heart,
  Share2,
  Phone,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Home,
  Building2,
  LandPlot,
  Store,
} from 'lucide-react'
import { useStore } from '@/store'
import { formatPrice, formatDate, cn } from '@/lib/utils'

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
  promoter?: {
    id: string
    name: string
  }
}

const propertyTypeIcons: Record<string, React.ReactNode> = {
  APARTMENT: <Building2 className="h-5 w-5" />,
  VILLA: <Home className="h-5 w-5" />,
  PLOT: <LandPlot className="h-5 w-5" />,
  COMMERCIAL: <Store className="h-5 w-5" />,
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, addToast } = useStore()
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [shortlistLoading, setShortlistLoading] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch property')
        }

        setProperty(data.property)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  // Check if property is shortlisted
  useEffect(() => {
    const checkShortlist = async () => {
      if (!user || !property) return

      try {
        const response = await fetch('/api/shortlist')
        const data = await response.json()

        if (response.ok) {
          const isInShortlist = data.shortlist.some(
            (item: { propertyId: string }) => item.propertyId === property.id
          )
          setIsShortlisted(isInShortlist)
        }
      } catch {
        // Ignore error
      }
    }

    checkShortlist()
  }, [user, property])

  const handleShortlist = async () => {
    if (!user) {
      addToast('Please login to shortlist properties', 'error')
      router.push('/login')
      return
    }

    if (user.role !== 'BUYER') {
      addToast('Only buyers can shortlist properties', 'error')
      return
    }

    try {
      setShortlistLoading(true)

      if (isShortlisted) {
        // Remove from shortlist
        await fetch(`/api/shortlist?propertyId=${property?.id}`, {
          method: 'DELETE',
        })
        setIsShortlisted(false)
        addToast('Removed from shortlist', 'success')
      } else {
        // Add to shortlist
        const response = await fetch('/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: property?.id }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to add to shortlist')
        }

        setIsShortlisted(true)
        addToast('Added to shortlist', 'success')
      }
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error'
      )
    } finally {
      setShortlistLoading(false)
    }
  }

  const handleUnlockContact = async () => {
    if (!user) {
      addToast('Please login to unlock contact', 'error')
      router.push('/login')
      return
    }

    // TODO: Implement payment flow
    addToast('Payment integration coming soon!', 'info')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      })
    } catch {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      addToast('Link copied to clipboard', 'success')
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
          <Link href="/properties" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const placeholderImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  ]

  const images = property.images.length > 0 ? property.images : placeholderImages

  return (
    <div className="pt-16 min-h-screen bg-secondary-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative aspect-[16/9]">
                <Image
                  src={images[selectedImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                {property.isVerified && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImage === index
                          ? 'border-primary-600'
                          : 'border-transparent'
                      )}
                    >
                      <Image
                        src={img}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {propertyTypeIcons[property.propertyType]}
                    <span className="text-sm text-secondary-600">
                      {property.propertyType} • {property.listingType}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    {property.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleShortlist}
                    disabled={shortlistLoading}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isShortlisted
                        ? 'bg-red-50 text-red-600'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    )}
                  >
                    <Heart
                      className={cn('h-5 w-5', isShortlisted && 'fill-current')}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-secondary-600 mb-6">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}, {property.city}, {property.state} -{' '}
                  {property.pincode}
                </span>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="text-sm text-secondary-500">Total Price</p>
                  <p className="text-lg font-semibold text-secondary-900">
                    {formatPrice(property.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Price per Sq.ft</p>
                  <p className="text-lg font-semibold text-primary-600">
                    {formatPrice(property.pricePerSqft)}/sqft
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Area</p>
                  <p className="text-lg font-semibold text-secondary-900">
                    {property.areaSqft.toLocaleString()} sq.ft
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Listed On</p>
                  <p className="text-lg font-semibold text-secondary-900">
                    {formatDate(property.createdAt)}
                  </p>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              {(property.bedrooms || property.bathrooms) && (
                <div className="flex gap-6 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-700">
                        {property.bedrooms} Bedrooms
                      </span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-700">
                        {property.bathrooms} Bathrooms
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-3">
                  Description
                </h2>
                <p className="text-secondary-600 whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900 mb-3">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-secondary-500 mb-1">Total Price</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {formatPrice(property.totalPrice)}
                </p>
                <p className="text-primary-600 font-medium">
                  {formatPrice(property.pricePerSqft)}/sq.ft
                </p>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                {contactUnlocked ? (
                  <>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <p className="text-sm text-secondary-600 mb-1">
                        Seller Contact
                      </p>
                      <p className="text-lg font-semibold text-secondary-900">
                        {property.promoter?.name}
                      </p>
                      <p className="flex items-center gap-2 text-primary-600">
                        <Phone className="h-4 w-4" />
                        +91 98765 43210
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-5 w-5" />
                      Schedule Visit
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-secondary-50 rounded-lg text-center">
                      <Lock className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-secondary-600 text-sm">
                        Seller contact is locked. Pay ₹99 to unlock and connect
                        directly.
                      </p>
                    </div>
                    <button
                      onClick={handleUnlockContact}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Lock className="h-5 w-5" />
                      Unlock Contact - ₹99
                    </button>
                  </>
                )}

                <button
                  onClick={handleShortlist}
                  disabled={shortlistLoading}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                    isShortlisted
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'btn-outline'
                  )}
                >
                  <Heart
                    className={cn('h-5 w-5', isShortlisted && 'fill-current')}
                  />
                  {isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                </button>
              </div>

              {/* Zero Brokerage Badge */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg text-center">
                <IndianRupee className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="font-medium text-primary-900">Zero Brokerage</p>
                <p className="text-sm text-primary-600">
                  Connect directly with owner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal - TODO: Implement */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Schedule a Visit</h2>
            <p className="text-secondary-600 mb-4">
              Appointment scheduling coming soon!
            </p>
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
