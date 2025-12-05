-- Migration: V6__create_email_verification_tokens.sql
-- Description: Email verification tokens for new user registration
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Only one active verification token per email
CREATE UNIQUE INDEX idx_email_verification_active 
  ON email_verification_tokens(email) 
  WHERE verified_at IS NULL AND expires_at > NOW();

-- Indexes
CREATE INDEX idx_email_verification_token ON email_verification_tokens(token_hash);
CREATE INDEX idx_email_verification_user ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_email ON email_verification_tokens(email);

-- Trigger to mark user as verified when token is used
CREATE OR REPLACE FUNCTION mark_email_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verified_at IS NOT NULL AND OLD.verified_at IS NULL THEN
    UPDATE users
    SET email_verified = TRUE,
        email_verified_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_email_verified
  AFTER UPDATE OF verified_at ON email_verification_tokens
  FOR EACH ROW
  EXECUTE FUNCTION mark_email_verified();

COMMENT ON TABLE email_verification_tokens IS 'Tokens for email verification (24 hour validity)';
