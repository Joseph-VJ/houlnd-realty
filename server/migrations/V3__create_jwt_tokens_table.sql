-- Migration: V3__create_jwt_tokens_table.sql
-- Description: JWT refresh tokens for token rotation and revocation
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE TABLE jwt_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  token_family UUID DEFAULT gen_random_uuid(),
  device_identifier VARCHAR(255),
  device_name VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  revoked_reason VARCHAR(100)
);

-- Indexes for performance
CREATE INDEX idx_jwt_user ON jwt_refresh_tokens(user_id);
CREATE INDEX idx_jwt_token_hash ON jwt_refresh_tokens(token_hash);
CREATE INDEX idx_jwt_expires ON jwt_refresh_tokens(expires_at);
CREATE INDEX idx_jwt_family ON jwt_refresh_tokens(token_family);
CREATE INDEX idx_jwt_active ON jwt_refresh_tokens(user_id, is_revoked) WHERE is_revoked = FALSE;

-- Function to revoke all tokens in a family (for token theft detection)
CREATE OR REPLACE FUNCTION revoke_token_family(family_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jwt_refresh_tokens 
  SET is_revoked = TRUE, revoked_at = NOW(), revoked_reason = 'FAMILY_REVOKED'
  WHERE token_family = family_id AND is_revoked = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM jwt_refresh_tokens WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE jwt_refresh_tokens IS 'Refresh tokens for JWT token rotation';
COMMENT ON COLUMN jwt_refresh_tokens.token_family IS 'Token family for detecting token theft';
COMMENT ON COLUMN jwt_refresh_tokens.revoked_reason IS 'Reason for revocation: LOGOUT, FAMILY_REVOKED, PASSWORD_CHANGE, ADMIN_ACTION';
