import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getUserById } from '@/lib/mockData'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      const user = getUserById(decoded.userId)
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user
      return NextResponse.json({ user: userWithoutPassword })
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}