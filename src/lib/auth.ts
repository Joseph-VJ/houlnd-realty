import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { getUserById } from './mockData'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  role: 'BUYER' | 'PROMOTER' | 'ADMIN'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = getUserById(payload.userId)
    
    if (!user) {
      return null
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: ('BUYER' | 'PROMOTER' | 'ADMIN')[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role as 'BUYER' | 'PROMOTER' | 'ADMIN')) {
    throw new Error('Forbidden')
  }
  return user
}
