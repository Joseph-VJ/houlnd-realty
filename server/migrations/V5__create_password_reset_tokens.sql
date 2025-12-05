-- Migration: V5__create_password_reset_tokens.sql
-- Description: Password reset tokens for forgot password flow
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Only allow one active reset token per user
CREATE UNIQUE INDEX idx_password_reset_active_user 
  ON password_reset_tokens(user_id) 
  WHERE used_at IS NULL AND expires_at > NOW();

-- Index for token lookup
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- Function to invalidate all previous reset tokens for a user
CREATE OR REPLACE FUNCTION invalidate_user_reset_tokens(uid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE password_reset_tokens
  SET used_at = NOW()
  WHERE user_id = uid
    AND used_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to check if token is valid
CREATE OR REPLACE FUNCTION is_reset_token_valid(token_hash_input VARCHAR(255))
RETURNS BOOLEAN AS $$
DECLARE
  token_record RECORD;
BEGIN
  SELECT * INTO token_record
  FROM password_reset_tokens
  WHERE token_hash = token_hash_input
    AND used_at IS NULL
    AND expires_at > NOW();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE password_reset_tokens IS 'Tokens for password reset flow (1 hour validity)';
COMMENT ON COLUMN password_reset_tokens.token_hash IS 'SHA-256 hash of the reset token sent to user';
