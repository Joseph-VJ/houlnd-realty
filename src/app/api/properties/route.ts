import { NextRequest, NextResponse } from 'next/server'
import { filterProperties } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      minPricePerSqft: searchParams.get('minPricePerSqft') ? Number(searchParams.get('minPricePerSqft')) : undefined,
      maxPricePerSqft: searchParams.get('maxPricePerSqft') ? Number(searchParams.get('maxPricePerSqft')) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      city: searchParams.get('city') || undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    }

    const properties = filterProperties(filters)
    
    // Parse JSON fields for response
    const formattedProperties = properties.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      amenities: JSON.parse(p.amenities),
    }))

    return NextResponse.json({
      properties: formattedProperties,
      total: formattedProperties.length,
      page: 1,
      limit: 12,
      totalPages: 1,
    })
  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create a mock property
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...body,
      pricePerSqft: body.totalPrice / body.areaSqft,
      images: JSON.stringify(body.images || []),
      amenities: JSON.stringify(body.amenities || []),
      status: 'ACTIVE',
      isVerified: false,
      verificationStatus: 'PENDING',
      promoterId: 'user-2',
      promoter: { id: 'user-2', name: 'Demo Seller' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: 'Property created successfully',
      property: {
        ...newProperty,
        images: JSON.parse(newProperty.images),
        amenities: JSON.parse(newProperty.amenities),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
