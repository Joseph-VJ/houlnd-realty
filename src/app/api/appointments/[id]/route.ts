import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// PUT - Update appointment status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        property: true,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    // Check authorization
    const isBuyer = appointment.userId === user.id
    const isOwner = appointment.property.ownerId === user.id
    const isAdmin = user.role === 'ADMIN'
    
    if (!isBuyer && !isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update this appointment' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { status, scheduledAt, notes } = body
    
    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      RESCHEDULED: ['CONFIRMED', 'CANCELLED'],
    }
    
    if (status && !validTransitions[appointment.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${appointment.status} to ${status}` },
        { status: 400 }
      )
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(notes !== undefined && { notes }),
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
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        property: true,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    // Check authorization
    const isBuyer = appointment.userId === user.id
    const isOwner = appointment.property.ownerId === user.id
    const isAdmin = user.role === 'ADMIN'
    
    if (!isBuyer && !isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this appointment' },
        { status: 403 }
      )
    }
    
    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
    
    return NextResponse.json({
      message: 'Appointment cancelled successfully',
    })
  } catch (error) {
    console.error('Cancel appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
