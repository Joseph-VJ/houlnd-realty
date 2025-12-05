import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, mockUsers } from '@/lib/mockData'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists in mock data
    const existingUser = getUserByEmail(validatedData.email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Create mock user (in demo mode, just return a fake user)
    const user = {
      id: `user_${Date.now()}`,
      email: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone || null,
      role: validatedData.role,
      isEmailVerified: false,
      createdAt: new Date(),
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'BUYER' | 'PROMOTER' | 'ADMIN',
    })
    
    // Create response with cookie
    const response = NextResponse.json({
      message: 'Registration successful',
      user,
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
