import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getPropertyById, getUserById, mockProperties } from '@/lib/mockData'
import { shortlistSchema } from '@/lib/validations'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

// In-memory shortlist for demo (resets on server restart)
const userShortlists = new Map<string, Set<string>>()

async function getCurrentUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return getUserById(decoded.userId)
  } catch {
    return null
  }
}

// GET - Get user's shortlist
export async function GET() {
  try {
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get user's shortlisted property IDs
    const shortlistSet = userShortlists.get(user.id) || new Set()
    
    // Build shortlist with property details
    const shortlist = Array.from(shortlistSet).map(propertyId => {
      const property = getPropertyById(propertyId)
      if (!property) return null
      
      const promoter = getUserById(property.promoterId)
      
      return {
        id: `shortlist_${user.id}_${propertyId}`,
        userId: user.id,
        propertyId,
        createdAt: new Date(),
        property: {
          ...property,
          promoter: promoter ? { id: promoter.id, name: promoter.name } : null,
        },
        isContactUnlocked: false,
      }
    }).filter(Boolean)
    
    return NextResponse.json({ shortlist })
  } catch (error) {
    console.error('Get shortlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add to shortlist
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = shortlistSchema.parse(body)
    
    // Check if property exists
    const property = getPropertyById(validatedData.propertyId)
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    // Get or create user's shortlist
    if (!userShortlists.has(user.id)) {
      userShortlists.set(user.id, new Set())
    }
    
    const shortlistSet = userShortlists.get(user.id)!
    
    if (shortlistSet.has(validatedData.propertyId)) {
      return NextResponse.json(
        { error: 'Property already in shortlist' },
        { status: 400 }
      )
    }
    
    // Add to shortlist
    shortlistSet.add(validatedData.propertyId)
    
    return NextResponse.json({
      message: 'Property added to shortlist',
      shortlist: {
        id: `shortlist_${user.id}_${validatedData.propertyId}`,
        propertyId: validatedData.propertyId,
        property,
      },
    })
  } catch (error) {
    console.error('Add to shortlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from shortlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }
    
    const shortlistSet = userShortlists.get(user.id)
    
    if (!shortlistSet || !shortlistSet.has(propertyId)) {
      return NextResponse.json(
        { error: 'Property not in shortlist' },
        { status: 404 }
      )
    }
    
    shortlistSet.delete(propertyId)
    
    return NextResponse.json({ message: 'Removed from shortlist' })
  } catch (error) {
    console.error('Remove from shortlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
