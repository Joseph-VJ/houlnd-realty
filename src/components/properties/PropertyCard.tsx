'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Maximize, CheckCircle } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

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

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : placeholderImage

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {property.propertyType}
            </span>
            <span className="bg-secondary-900 text-white text-xs px-2 py-1 rounded-full">
              {property.listingType}
            </span>
          </div>

          {/* Verified Badge */}
          {property.isVerified && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </span>
            </div>
          )}

          {/* Price per Sq.ft Badge - CRITICAL FEATURE */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/95 text-primary-700 text-sm font-bold px-3 py-1.5 rounded-lg shadow">
              ₹{Math.round(property.pricePerSqft).toLocaleString()}/sq.ft
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-secondary-900 text-lg mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center text-secondary-500 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.city}, {property.state}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-secondary-600 text-sm mb-3">
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms} Baths
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {property.areaSqft.toLocaleString()} sq.ft
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
            <div>
              <p className="text-xl font-bold text-secondary-900">
                {formatPrice(property.totalPrice)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                // TODO: Add to shortlist
              }}
              className="p-2 rounded-full hover:bg-secondary-100 transition-colors"
            >
              <Heart className="h-5 w-5 text-secondary-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
