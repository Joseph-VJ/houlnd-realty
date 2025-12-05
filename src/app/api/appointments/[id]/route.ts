import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getPropertyById, getUserById } from '@/lib/mockData'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

// In-memory appointments storage (shared with parent route in a real app)
interface MockAppointment {
  id: string
  buyerId: string
  propertyId: string
  scheduledDate: Date
  scheduledTime: string
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED'
  createdAt: Date
}

const appointments = new Map<string, MockAppointment>()

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

// PUT - Update appointment status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const appointment = appointments.get(id)
    
    if (!appointment) {
      // For demo, create a mock appointment response
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    const property = getPropertyById(appointment.propertyId)
    
    const body = await request.json()
    const { status, scheduledAt, notes } = body
    
    // Update appointment in memory
    if (status) appointment.status = status
    if (notes !== undefined) appointment.notes = notes
    if (scheduledAt) appointment.scheduledDate = new Date(scheduledAt)
    
    appointments.set(id, appointment)
    
    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: {
        ...appointment,
        property,
      },
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
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const appointment = appointments.get(id)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    // Mark as cancelled
    appointment.status = 'CANCELLED'
    appointments.set(id, appointment)
    
    return NextResponse.json({ message: 'Appointment cancelled' })
  } catch (error) {
    console.error('Cancel appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
