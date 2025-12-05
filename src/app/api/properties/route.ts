import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// GET - List properties with filters (Sq.ft Price Point as main filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const propertyType = searchParams.get('propertyType')
    const listingType = searchParams.get('listingType')
    const city = searchParams.get('city')
    const minPricePerSqft = searchParams.get('minPricePerSqft')
    const maxPricePerSqft = searchParams.get('maxPricePerSqft')
    const minTotalPrice = searchParams.get('minTotalPrice')
    const maxTotalPrice = searchParams.get('maxTotalPrice')
    const minArea = searchParams.get('minArea')
    const maxArea = searchParams.get('maxArea')
    const bedrooms = searchParams.get('bedrooms')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const promoterId = searchParams.get('promoterId')
    
    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      status: 'ACTIVE',
    }
    
    // Only show verified properties to non-owners
    if (!promoterId) {
      where.isVerified = true
    } else {
      where.promoterId = promoterId
    }
    
    // CRITICAL: Sq.ft Price Point Filter - Main Feature
    if (minPricePerSqft || maxPricePerSqft) {
      where.pricePerSqft = {}
      if (minPricePerSqft) {
        where.pricePerSqft.gte = parseFloat(minPricePerSqft)
      }
      if (maxPricePerSqft) {
        where.pricePerSqft.lte = parseFloat(maxPricePerSqft)
      }
    }
    
    // Property Type Filter
    if (propertyType) {
      where.propertyType = propertyType
    }
    
    // Listing Type Filter
    if (listingType) {
      where.listingType = listingType
    }
    
    // City Filter
    if (city) {
      where.city = {
        contains: city,
      }
    }
    
    // Budget Filter
    if (minTotalPrice || maxTotalPrice) {
      where.totalPrice = {}
      if (minTotalPrice) {
        where.totalPrice.gte = parseFloat(minTotalPrice)
      }
      if (maxTotalPrice) {
        where.totalPrice.lte = parseFloat(maxTotalPrice)
      }
    }
    
    // Area Filter
    if (minArea || maxArea) {
      where.areaSqft = {}
      if (minArea) {
        where.areaSqft.gte = parseFloat(minArea)
      }
      if (maxArea) {
        where.areaSqft.lte = parseFloat(maxArea)
      }
    }
    
    // Bedrooms Filter
    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }
    
    // Sorting
    const orderBy: Prisma.PropertyOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    }
    
    // Execute query
    const properties = await prisma.property.findMany({
      where,
      orderBy,
      include: {
        promoter: {
          select: {
            id: true,
            name: true,
            // Phone is NOT included - gated access
          },
        },
        _count: {
          select: {
            shortlists: true,
          },
        },
      },
    })
    
    // Parse JSON fields
    const formattedProperties = properties.map((property) => ({
      ...property,
      images: JSON.parse(property.images || '[]'),
      amenities: JSON.parse(property.amenities || '[]'),
    }))
    
    return NextResponse.json({
      properties: formattedProperties,
    })
  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new property (Promoters only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (user.role !== 'PROMOTER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only promoters can post properties' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.totalPrice || !body.areaSqft) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Calculate price per sq.ft
    const pricePerSqft = body.totalPrice / body.areaSqft
    
    // Create property
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        propertyType: body.propertyType || 'APARTMENT',
        listingType: body.listingType || 'SALE',
        totalPrice: body.totalPrice,
        areaSqft: body.areaSqft,
        pricePerSqft,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        latitude: body.latitude,
        longitude: body.longitude,
        images: JSON.stringify(body.images || []),
        amenities: JSON.stringify(body.amenities || []),
        status: 'ACTIVE',
        isVerified: false,
        verificationStatus: 'PENDING',
        promoterId: user.id,
      },
      include: {
        promoter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    
    return NextResponse.json({
      message: 'Property created successfully. Pending verification.',
      property: {
        ...property,
        images: JSON.parse(property.images || '[]'),
        amenities: JSON.parse(property.amenities || '[]'),
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
