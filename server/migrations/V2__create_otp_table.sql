-- Migration: V2__create_otp_table.sql
-- Description: OTP verification tokens for email/phone verification
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE TABLE otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  otp_code VARCHAR(6) NOT NULL,
  otp_type VARCHAR(50) NOT NULL CHECK (otp_type IN ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_2FA')),
  purpose VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_otp_user_type ON otp_tokens(user_id, otp_type);
CREATE INDEX idx_otp_expires ON otp_tokens(expires_at);
CREATE INDEX idx_otp_code ON otp_tokens(otp_code) WHERE is_verified = FALSE;

-- Clean up expired tokens (can be run as scheduled job)
CREATE OR REPLACE FUNCTION cleanup_expired_otp_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_tokens WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE otp_tokens IS 'OTP tokens for various verification purposes';
COMMENT ON COLUMN otp_tokens.verification_attempts IS 'Number of failed verification attempts';
COMMENT ON COLUMN otp_tokens.max_attempts IS 'Maximum allowed attempts before token invalidation';
