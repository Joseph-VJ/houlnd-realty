import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { appointmentSchema } from '@/lib/validations'

// GET - Get user's appointments
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    let appointments
    
    if (user.role === 'BUYER') {
      // Buyer sees their appointments
      appointments = await prisma.appointment.findMany({
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
        orderBy: { scheduledAt: 'asc' },
      })
    } else if (user.role === 'PROMOTER') {
      // Promoter sees appointments for their properties
      appointments = await prisma.appointment.findMany({
        where: {
          property: {
            ownerId: user.id,
          },
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
      })
    } else {
      // Admin sees all
      appointments = await prisma.appointment.findMany({
        include: {
          property: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
      })
    }
    
    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Schedule appointment
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
    const validatedData = appointmentSchema.parse(body)
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      include: {
        owner: {
          select: { id: true, name: true },
        },
      },
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    if (property.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Property is not available for visits' },
        { status: 400 }
      )
    }
    
    // Check for conflicting appointments
    const scheduledAt = new Date(validatedData.scheduledAt)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        propertyId: validatedData.propertyId,
        scheduledAt,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })
    
    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }
    
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        propertyId: validatedData.propertyId,
        scheduledAt,
        notes: validatedData.notes,
        buyerPhone: validatedData.buyerPhone,
        status: 'PENDING',
      },
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
    })
    
    return NextResponse.json({
      message: 'Appointment scheduled successfully',
      appointment,
    }, { status: 201 })
  } catch (error) {
    console.error('Schedule appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
