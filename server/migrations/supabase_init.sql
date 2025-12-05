-- Supabase Migration: Create all tables for Houlnd Realty
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'PROMOTER', 'ADMIN')),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  phone_verified BOOLEAN DEFAULT FALSE,
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  profile_photo_url TEXT,
  company_name VARCHAR(255),
  rera_number VARCHAR(100),
  login_count INTEGER DEFAULT 0,
  last_login_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =========================================
-- JWT REFRESH TOKENS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS jwt_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason VARCHAR(50),
  user_agent TEXT,
  ip_address VARCHAR(45),
  device_fingerprint VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for jwt_refresh_tokens
CREATE INDEX IF NOT EXISTS idx_jwt_tokens_user ON jwt_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_jwt_tokens_hash ON jwt_refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_jwt_tokens_expires ON jwt_refresh_tokens(expires_at);

-- =========================================
-- LOGIN AUDIT LOGS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS login_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email_attempted VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'SUCCESS',
    'FAILED_WRONG_PASSWORD',
    'FAILED_USER_NOT_FOUND',
    'FAILED_ACCOUNT_LOCKED',
    'FAILED_RATE_LIMITED',
    'FAILED_EMAIL_NOT_VERIFIED',
    'FAILED_ACCOUNT_DISABLED',
    'LOGOUT'
  )),
  failure_reason TEXT,
  session_id UUID,
  geo_location JSONB,
  device_trusted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for login_audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON login_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_ip ON login_audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_status ON login_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON login_audit_logs(created_at DESC);

-- =========================================
-- PASSWORD RESET TOKENS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);

-- =========================================
-- EMAIL VERIFICATION TOKENS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for email_verification_tokens
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verification_tokens(user_id);

-- =========================================
-- OTP TOKENS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS otp_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_hash VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL', 'SMS')),
  purpose VARCHAR(30) NOT NULL CHECK (purpose IN ('LOGIN', 'REGISTRATION', 'PASSWORD_RESET', 'PHONE_VERIFICATION')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for otp_tokens
CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_tokens(expires_at);

-- =========================================
-- PROPERTIES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL', 'FARMHOUSE')),
  listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('SALE', 'RENT')),
  price DECIMAL(15, 2) NOT NULL,
  area_sqft INTEGER NOT NULL,
  price_per_sqft DECIMAL(10, 2) GENERATED ALWAYS AS (price / NULLIF(area_sqft, 0)) STORED,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER DEFAULT 0,
  floor_number INTEGER,
  total_floors INTEGER,
  facing VARCHAR(20),
  furnishing VARCHAR(20) CHECK (furnishing IN ('UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED')),
  possession_status VARCHAR(20) CHECK (possession_status IN ('READY_TO_MOVE', 'UNDER_CONSTRUCTION')),
  age_of_property INTEGER,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities JSONB DEFAULT '[]'::JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE')),
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for properties
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_price_sqft ON properties(price_per_sqft);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- =========================================
-- PROPERTY IMAGES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for property_images
CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);

-- =========================================
-- SHORTLIST TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS shortlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Indexes for shortlist
CREATE INDEX IF NOT EXISTS idx_shortlist_user ON shortlist(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_property ON shortlist(property_id);

-- =========================================
-- INQUIRIES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESPONDED', 'CLOSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON inquiries(seller_id);

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jwt_refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status = 'ACTIVE' AND deleted_at IS NULL);

CREATE POLICY "Owners can manage own properties" ON properties
  FOR ALL USING (auth.uid() = owner_id);

-- Shortlist policies
CREATE POLICY "Users can manage own shortlist" ON shortlist
  FOR ALL USING (auth.uid() = user_id);

-- Inquiries policies
CREATE POLICY "Buyers can view own inquiries" ON inquiries
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view inquiries on their properties" ON inquiries
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Service role bypass (for server-side operations)
-- The service role key automatically bypasses RLS

-- =========================================
-- STORAGE BUCKETS
-- =========================================
-- Run these in Supabase Dashboard > Storage

-- Create buckets (via Dashboard or API):
-- 1. property-images (public)
-- 2. profile-photos (private)
-- 3. documents (private)

-- =========================================
-- FUNCTIONS
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
