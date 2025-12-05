import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getPropertyById, getUserById } from '@/lib/mockData'
import { appointmentSchema } from '@/lib/validations'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

// In-memory appointments for demo
interface MockAppointment {
  id: string
  buyerId: string
  propertyId: string
  scheduledDate: Date
  scheduledTime: string
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  createdAt: Date
}

const appointments: MockAppointment[] = []

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

// GET - Get user's appointments
export async function GET() {
  try {
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    let userAppointments: typeof appointments
    
    if (user.role === 'BUYER') {
      userAppointments = appointments.filter(a => a.buyerId === user.id)
    } else if (user.role === 'PROMOTER') {
      userAppointments = appointments.filter(a => {
        const property = getPropertyById(a.propertyId)
        return property?.promoterId === user.id
      })
    } else {
      userAppointments = appointments
    }
    
    // Enrich with property and user data
    const enrichedAppointments = userAppointments.map(apt => {
      const property = getPropertyById(apt.propertyId)
      const buyer = getUserById(apt.buyerId)
      const promoter = property ? getUserById(property.promoterId) : null
      
      return {
        ...apt,
        property: property ? {
          ...property,
          promoter: promoter ? { id: promoter.id, name: promoter.name } : null,
        } : null,
        buyer: buyer ? { id: buyer.id, name: buyer.name, email: buyer.email } : null,
      }
    })
    
    return NextResponse.json({ appointments: enrichedAppointments })
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
    const user = await getCurrentUserFromToken()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = appointmentSchema.parse(body)
    
    // Check if property exists
    const property = getPropertyById(validatedData.propertyId)
    
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
    
    // Create appointment
    const scheduledDate = new Date(validatedData.scheduledDate)
    const appointment: MockAppointment = {
      id: `apt_${Date.now()}`,
      buyerId: user.id,
      propertyId: validatedData.propertyId,
      scheduledDate,
      scheduledTime: validatedData.scheduledTime,
      notes: validatedData.notes,
      status: 'PENDING',
      createdAt: new Date(),
    }
    
    appointments.push(appointment)
    
    const promoter = getUserById(property.promoterId)
    
    return NextResponse.json({
      message: 'Appointment scheduled successfully',
      appointment: {
        ...appointment,
        property: {
          ...property,
          promoter: promoter ? { id: promoter.id, name: promoter.name } : null,
        },
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Schedule appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
