-- Migration: V4__create_login_audit_log.sql
-- Description: Audit log for login attempts (security monitoring)
-- Author: Houlnd Realty Team
-- Date: 2025-12-05

CREATE TABLE login_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for security analysis
CREATE INDEX idx_audit_user ON login_audit_logs(user_id);
CREATE INDEX idx_audit_ip ON login_audit_logs(ip_address);
CREATE INDEX idx_audit_status ON login_audit_logs(status);
CREATE INDEX idx_audit_created ON login_audit_logs(created_at DESC);
CREATE INDEX idx_audit_email ON login_audit_logs(email_attempted);

-- Composite index for failed attempts analysis
CREATE INDEX idx_audit_failed_ip ON login_audit_logs(ip_address, created_at DESC) 
  WHERE status LIKE 'FAILED%';

-- Function to count recent failed attempts from IP
CREATE OR REPLACE FUNCTION count_failed_attempts_from_ip(
  check_ip VARCHAR(45),
  window_minutes INTEGER DEFAULT 15
)
RETURNS INTEGER AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM login_audit_logs
  WHERE ip_address = check_ip
    AND status LIKE 'FAILED%'
    AND created_at > NOW() - (window_minutes || ' minutes')::INTERVAL;
  RETURN attempt_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE login_audit_logs IS 'Audit trail for all login attempts';
COMMENT ON COLUMN login_audit_logs.geo_location IS 'JSON with country, city, region from IP lookup';
COMMENT ON COLUMN login_audit_logs.device_fingerprint IS 'Browser/device fingerprint for anomaly detection';
