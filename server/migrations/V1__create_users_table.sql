-- Migration: V1__create_users_table.sql
-- Description: Create core users table with all authentication fields
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('CUSTOMER', 'PROMOTER', 'ADMIN')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  login_count INTEGER DEFAULT 0,
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  last_failed_login_at TIMESTAMP,
  account_locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Core users table for authentication and authorization';
COMMENT ON COLUMN users.role IS 'User role: CUSTOMER (buyer), PROMOTER (seller), or ADMIN';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for brute force protection';
COMMENT ON COLUMN users.account_locked_until IS 'Timestamp when account lockout expires';
