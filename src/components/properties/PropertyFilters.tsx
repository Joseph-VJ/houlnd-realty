'use client'

import { Search, X } from 'lucide-react'

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

interface PropertyFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  onClearFilters: () => void
}

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'PLOT', label: 'Plot' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

const cities = [
  { value: '', label: 'All Cities' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Hyderabad', label: 'Hyderabad' },
]

const pricePerSqftRanges = [
  { min: '', max: '', label: 'Any' },
  { min: '0', max: '3000', label: '₹0 - ₹3,000' },
  { min: '3000', max: '6000', label: '₹3,000 - ₹6,000' },
  { min: '6000', max: '10000', label: '₹6,000 - ₹10,000' },
  { min: '10000', max: '20000', label: '₹10,000 - ₹20,000' },
  { min: '20000', max: '', label: '₹20,000+' },
]

export default function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: PropertyFiltersProps) {
  const handleChange = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handlePricePerSqftChange = (rangeIndex: number) => {
    const range = pricePerSqftRanges[rangeIndex]
    onFilterChange({
      ...filters,
      minPricePerSqft: range.min,
      maxPricePerSqft: range.max,
    })
  }

  const getCurrentPriceRangeIndex = () => {
    return pricePerSqftRanges.findIndex(
      (r) => r.min === filters.minPricePerSqft && r.max === filters.maxPricePerSqft
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* CRITICAL: Price per Sq.ft Filter - Main Feature */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary-600" />
              Price per Sq.ft (Main Filter)
            </span>
          </label>
          <select
            value={getCurrentPriceRangeIndex()}
            onChange={(e) => handlePricePerSqftChange(parseInt(e.target.value))}
            className="input-field"
          >
            {pricePerSqftRanges.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="input-field"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Listing Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('listingType', '')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.listingType === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleChange('listingType', 'SALE')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.listingType === 'SALE'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Sale
            </button>
            <button
              onClick={() => handleChange('listingType', 'RENT')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.listingType === 'RENT'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="input-field"
          >
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Budget Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minTotalPrice}
              onChange={(e) => handleChange('minTotalPrice', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxTotalPrice}
              onChange={(e) => handleChange('maxTotalPrice', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Area (Sq.ft)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minArea}
              onChange={(e) => handleChange('minArea', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxArea}
              onChange={(e) => handleChange('maxArea', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            {['', '1', '2', '3', '4', '5'].map((num) => (
              <button
                key={num}
                onClick={() => handleChange('bedrooms', num)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  filters.bedrooms === num
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {num === '' ? 'Any' : num === '5' ? '5+' : num}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-')
              onFilterChange({ ...filters, sortBy, sortOrder })
            }}
            className="input-field"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="pricePerSqft-asc">Price/Sq.ft: Low to High</option>
            <option value="pricePerSqft-desc">Price/Sq.ft: High to Low</option>
            <option value="totalPrice-asc">Price: Low to High</option>
            <option value="totalPrice-desc">Price: High to Low</option>
            <option value="areaSqft-desc">Area: Largest First</option>
            <option value="areaSqft-asc">Area: Smallest First</option>
          </select>
        </div>
      </div>
    </div>
  )
}
