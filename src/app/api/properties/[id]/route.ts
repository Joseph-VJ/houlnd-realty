import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        promoter: { select: { id: true, name: true } },
        _count: { select: { shortlists: true, appointments: true } },
      },
    })
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    if (property.status !== 'ACTIVE') {
      if (!user || (user.id !== property.promoterId && user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Property not available' }, { status: 404 })
      }
    }
    
    let isContactUnlocked = false
    let promoterPhone = null
    
    if (user) {
      const unlock = await prisma.contactUnlock.findUnique({
        where: { userId_propertyId: { userId: user.id, propertyId: id } },
      })
      isContactUnlocked = !!unlock
      if (isContactUnlocked || user.id === property.promoterId || user.role === 'ADMIN') {
        const promoter = await prisma.user.findUnique({
          where: { id: property.promoterId },
          select: { phone: true },
        })
        promoterPhone = promoter?.phone
      }
    }
    
    let isShortlisted = false
    if (user && user.role === 'BUYER') {
      const shortlist = await prisma.shortlist.findUnique({
        where: { userId_propertyId: { userId: user.id, propertyId: id } },
      })
      isShortlisted = !!shortlist
    }
    
    return NextResponse.json({
      property: {
        ...property,
        images: JSON.parse(property.images || '[]'),
        amenities: JSON.parse(property.amenities || '[]'),
        promoterPhone,
        isContactUnlocked,
        isShortlisted,
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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    
    const property = await prisma.property.findUnique({ where: { id } })
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    if (user.id !== property.promoterId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    const body = await request.json()
    let pricePerSqft = property.pricePerSqft
    if (body.totalPrice || body.areaSqft) {
      pricePerSqft = (body.totalPrice || property.totalPrice) / (body.areaSqft || property.areaSqft)
    }
    
    const updated = await prisma.property.update({
      where: { id },
      data: { ...body, pricePerSqft, images: body.images ? JSON.stringify(body.images) : undefined, amenities: body.amenities ? JSON.stringify(body.amenities) : undefined },
    })
    
    return NextResponse.json({ message: 'Property updated', property: { ...updated, images: JSON.parse(updated.images || '[]'), amenities: JSON.parse(updated.amenities || '[]') } })
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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    
    const property = await prisma.property.findUnique({ where: { id } })
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    if (user.id !== property.promoterId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    await prisma.property.update({ where: { id }, data: { status: 'DELETED' } })
    return NextResponse.json({ message: 'Property deleted' })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
