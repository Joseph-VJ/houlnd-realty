import { z } from 'zod'

// User Registration Schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['BUYER', 'PROMOTER']).default('BUYER'),
})

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Property Filter Schema - Core Feature for Sq.ft Price
export const propertyFilterSchema = z.object({
  // Sq.ft Price Point Filter - CRITICAL FEATURE
  pricePerSqftMin: z.coerce.number().min(0).optional(),
  pricePerSqftMax: z.coerce.number().optional(),
  
  // Basic Filters
  type: z.enum(['PLOT', 'APARTMENT', 'VILLA', 'COMMERCIAL', 'INDEPENDENT_HOUSE', 'FARM_LAND']).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  
  // Budget Filter
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().optional(),
  
  // Area Filter
  areaSqftMin: z.coerce.number().min(0).optional(),
  areaSqftMax: z.coerce.number().optional(),
  
  // Additional Filters
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  isNegotiable: z.coerce.boolean().optional(),
  
  // Pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  
  // Sorting
  sortBy: z.enum(['pricePerSqft', 'totalPrice', 'areaSqft', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Property Creation Schema
export const createPropertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  type: z.enum(['PLOT', 'APARTMENT', 'VILLA', 'COMMERCIAL', 'INDEPENDENT_HOUSE', 'FARM_LAND']),
  
  // Location
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Pricing - Required for Sq.ft calculation
  totalPrice: z.number().positive('Total price must be positive'),
  areaSqft: z.number().positive('Area must be positive'),
  isNegotiable: z.boolean().default(false),
  
  // Property Details
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(0).optional(),
  facing: z.string().optional(),
  ageOfProperty: z.number().int().min(0).optional(),
  
  // Media
  videoUrl: z.string().url().optional(),
  
  // Amenities
  amenities: z.array(z.object({
    name: z.string(),
    price: z.number().optional(),
    included: z.boolean().default(true),
  })).optional(),
  
  // Visit Time Slots
  visitTimeSlots: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean().default(true),
  })).optional(),
  
  // Commission Agreement - Must agree for free posting
  commissionAgreed: z.boolean(),
  commissionRate: z.number().min(0).max(10).optional(),
})

// Shortlist Schema
export const shortlistSchema = z.object({
  propertyId: z.string(),
  notes: z.string().optional(),
})

// Appointment Schema
export const appointmentSchema = z.object({
  propertyId: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  notes: z.string().optional(),
})

// Contact Unlock Schema
export const contactUnlockSchema = z.object({
  propertyId: z.string(),
})

// Payment Verification Schema
export const paymentVerificationSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>
export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type ShortlistInput = z.infer<typeof shortlistSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type ContactUnlockInput = z.infer<typeof contactUnlockSchema>
