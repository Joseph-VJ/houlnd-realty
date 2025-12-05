'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Upload,
  Loader2,
  MapPin,
  IndianRupee,
  Home,
  Building2,
  LandPlot,
  Store,
  CheckCircle,
} from 'lucide-react'
import { useStore } from '@/store'

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment', icon: Building2 },
  { value: 'VILLA', label: 'Villa', icon: Home },
  { value: 'PLOT', label: 'Plot', icon: LandPlot },
  { value: 'COMMERCIAL', label: 'Commercial', icon: Store },
]

const listingTypes = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
]

const amenitiesList = [
  'Parking',
  'Security',
  'Power Backup',
  'Lift',
  'Garden',
  'Swimming Pool',
  'Gym',
  'Club House',
  'Children Play Area',
  'Intercom',
  'Water Supply 24x7',
  'Gated Community',
]

export default function AddPropertyPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, addToast } = useStore()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    totalPrice: '',
    areaSqft: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    amenities: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/seller/add-property')
      return
    }

    if (user && user.role !== 'PROMOTER' && user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [user, authLoading, router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const calculatePricePerSqft = () => {
    const price = parseFloat(formData.totalPrice)
    const area = parseFloat(formData.areaSqft)
    if (price && area) {
      return Math.round(price / area)
    }
    return 0
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim())
      newErrors.description = 'Description is required'
    if (!formData.totalPrice) newErrors.totalPrice = 'Price is required'
    if (!formData.areaSqft) newErrors.areaSqft = 'Area is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          propertyType: formData.propertyType,
          listingType: formData.listingType,
          totalPrice: parseFloat(formData.totalPrice),
          areaSqft: parseFloat(formData.areaSqft),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms
            ? parseInt(formData.bathrooms)
            : undefined,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          amenities: formData.amenities,
          images: [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property')
      }

      addToast('Property listed successfully!', 'success')
      router.push('/dashboard/seller')
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const pricePerSqft = calculatePricePerSqft()

  return (
    <div className="pt-16 min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">
            Add New Property
          </h1>
          <p className="text-secondary-600">
            Fill in the details to list your property
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Type */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Property Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        propertyType: type.value,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.propertyType === type.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        formData.propertyType === type.value
                          ? 'text-primary-600'
                          : 'text-secondary-400'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        formData.propertyType === type.value
                          ? 'text-primary-900'
                          : 'text-secondary-700'
                      }`}
                    >
                      {type.label}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Listing Type */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Listing Type
              </label>
              <div className="flex gap-4">
                {listingTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.listingType === type.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="listingType"
                      value={type.value}
                      checked={formData.listingType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={
                        formData.listingType === type.value
                          ? 'text-primary-900'
                          : 'text-secondary-700'
                      }
                    >
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Details */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Basic Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Property Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Spacious 3BHK Apartment in Whitefield"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`input-field ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe your property in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bathrooms"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Price Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="totalPrice"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Total Price (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.totalPrice ? 'border-red-500' : ''
                    }`}
                    placeholder="5000000"
                  />
                </div>
                {errors.totalPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalPrice}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="areaSqft"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Area (Sq.ft) *
                </label>
                <input
                  type="number"
                  id="areaSqft"
                  name="areaSqft"
                  value={formData.areaSqft}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.areaSqft ? 'border-red-500' : ''
                  }`}
                  placeholder="1200"
                />
                {errors.areaSqft && (
                  <p className="mt-1 text-sm text-red-600">{errors.areaSqft}</p>
                )}
              </div>
            </div>

            {/* Price per Sqft Display */}
            {pricePerSqft > 0 && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-600">
                  Calculated Price per Sq.ft
                </p>
                <p className="text-2xl font-bold text-primary-900">
                  ₹{pricePerSqft.toLocaleString()}/sq.ft
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              <MapPin className="inline h-5 w-5 mr-2" />
              Location
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.address ? 'border-red-500' : ''
                  }`}
                  placeholder="Street address, building name, etc."
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                    placeholder="Bangalore"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.state ? 'border-red-500' : ''
                    }`}
                    placeholder="Karnataka"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.pincode ? 'border-red-500' : ''
                    }`}
                    placeholder="560066"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-secondary-200 text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  {formData.amenities.includes(amenity) && (
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                  )}
                  <span className="text-sm">{amenity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Images - Coming Soon */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              <Upload className="inline h-5 w-5 mr-2" />
              Property Images
            </h2>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">
                Image upload coming soon. Your property will be listed with
                placeholder images for now.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'List Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
