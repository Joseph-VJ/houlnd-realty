import { NextRequest, NextResponse } from 'next/server'
import { getPropertyById, getUserById } from '@/lib/mockData'

// In-memory state for demo
const contactUnlocks = new Set<string>()
const shortlists = new Set<string>()

function getCurrentUserFromCookie(): { id: string; role: string } | null {
  // For demo, we'll check if there's a user context
  // In real app this would decode JWT from cookie
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const property = getPropertyById(id)
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    // Get promoter info
    const promoter = getUserById(property.promoterId)
    
    // For demo, contact is always unlocked and property is not shortlisted by default
    const isContactUnlocked = false
    const isShortlisted = false
    const promoterPhone = null
    
    return NextResponse.json({
      property: {
        ...property,
        promoter: promoter ? { id: promoter.id, name: promoter.name } : null,
        promoterPhone,
        isContactUnlocked,
        isShortlisted,
        _count: { shortlists: Math.floor(Math.random() * 50), appointments: Math.floor(Math.random() * 20) },
      },
    })
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const property = getPropertyById(id)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    // For demo, just return success with the existing property
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Property updated (demo mode)', 
      property: { ...property, ...body }
    })
  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const property = getPropertyById(id)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    // For demo, just return success
    return NextResponse.json({ message: 'Property deleted (demo mode)' })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
