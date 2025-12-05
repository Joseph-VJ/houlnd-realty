/**
 * Supabase Client Configuration
 * Connects to Supabase for database, auth, and storage
 * 
 * @module config/supabase
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

/**
 * Public Supabase client (for client-side operations)
 * Uses the anon key with RLS policies applied
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

/**
 * Admin Supabase client (for server-side operations)
 * Uses the service role key to bypass RLS
 * IMPORTANT: Only use this on the server, never expose to client
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Get the admin client (throws if not configured)
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return supabaseAdmin;
}

/**
 * Database table names
 */
export const TABLES = {
  USERS: 'users',
  PROPERTIES: 'properties',
  PROPERTY_IMAGES: 'property_images',
  SHORTLIST: 'shortlist',
  INQUIRIES: 'inquiries',
  JWT_REFRESH_TOKENS: 'jwt_refresh_tokens',
  LOGIN_AUDIT_LOGS: 'login_audit_logs',
  PASSWORD_RESET_TOKENS: 'password_reset_tokens',
  EMAIL_VERIFICATION_TOKENS: 'email_verification_tokens',
  OTP_TOKENS: 'otp_tokens'
} as const;

/**
 * Storage bucket names
 */
export const BUCKETS = {
  PROPERTY_IMAGES: 'property-images',
  PROFILE_PHOTOS: 'profile-photos',
  DOCUMENTS: 'documents'
} as const;

/**
 * Health check for Supabase connection
 */
export async function supabaseHealthCheck(): Promise<boolean> {
  try {
    const { error } = await supabase.from(TABLES.USERS).select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

export default {
  supabase,
  supabaseAdmin,
  getSupabaseAdmin,
  TABLES,
  BUCKETS,
  supabaseHealthCheck
};
