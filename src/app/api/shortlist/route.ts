import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { shortlistSchema } from '@/lib/validations'

// GET - Get user's shortlist
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const shortlist = await prisma.shortlist.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    // Check which properties have unlocked contacts
    const unlockedPropertyIds = await prisma.contactUnlock.findMany({
      where: {
        userId: user.id,
        propertyId: { in: shortlist.map(s => s.propertyId) },
      },
      select: { propertyId: true },
    })
    
    const unlockedSet = new Set(unlockedPropertyIds.map(u => u.propertyId))
    
    const shortlistWithUnlockStatus = shortlist.map(item => ({
      ...item,
      isContactUnlocked: unlockedSet.has(item.propertyId),
    }))
    
    return NextResponse.json({ shortlist: shortlistWithUnlockStatus })
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
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = shortlistSchema.parse(body)
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    // Check if already shortlisted
    const existing = await prisma.shortlist.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId: validatedData.propertyId,
        },
      },
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Property already in shortlist' },
        { status: 400 }
      )
    }
    
    // Create shortlist entry
    const shortlist = await prisma.shortlist.create({
      data: {
        userId: user.id,
        propertyId: validatedData.propertyId,
        notes: validatedData.notes,
      },
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    })
    
    return NextResponse.json({
      message: 'Property added to shortlist',
      shortlist,
    }, { status: 201 })
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
    const user = await getCurrentUser()
    
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
        { error: 'Property ID required' },
        { status: 400 }
      )
    }
    
    await prisma.shortlist.delete({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    })
    
    return NextResponse.json({
      message: 'Property removed from shortlist',
    })
  } catch (error) {
    console.error('Remove from shortlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
