/**
 * Authentication Service
 * Handles all authentication-related business logic
 * 
 * @module services/AuthService
 */

import { query, transaction } from '../config/database';
import { tokenBlacklist } from '../config/redis';
import { JWTService, TokenPayload, TokenPair } from '../utils/jwt';
import { hashPassword, comparePassword, validatePassword, PasswordValidationResult } from '../utils/password';
import crypto from 'crypto';

// Types
export type UserRole = 'CUSTOMER' | 'PROMOTER' | 'ADMIN';

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  role: UserRole;
  email_verified: boolean;
  phone_verified: boolean;
  profile_photo_url: string | null;
  login_count: number;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  tokens?: TokenPair;
  error?: string;
  errorCode?: string;
}

export interface RefreshResult {
  success: boolean;
  tokens?: TokenPair;
  error?: string;
}

// Constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

/**
 * Authentication Service Class
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput): Promise<AuthResult> {
    try {
      // Validate password
      const passwordValidation = validatePassword(input.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', '),
          errorCode: 'INVALID_PASSWORD'
        };
      }

      // Validate email format
      if (!this.isValidEmail(input.email)) {
        return {
          success: false,
          error: 'Invalid email format',
          errorCode: 'INVALID_EMAIL'
        };
      }

      // Check if email already exists
      const existingUser = await query<User>(
        'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
        [input.email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        return {
          success: false,
          error: 'Email already registered',
          errorCode: 'EMAIL_EXISTS'
        };
      }

      // Check phone if provided
      if (input.phone) {
        const existingPhone = await query(
          'SELECT id FROM users WHERE phone = $1 AND deleted_at IS NULL',
          [input.phone]
        );
        if (existingPhone.rows.length > 0) {
          return {
            success: false,
            error: 'Phone number already registered',
            errorCode: 'PHONE_EXISTS'
          };
        }
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const result = await query<User>(
        `INSERT INTO users (email, password_hash, full_name, phone, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, phone, full_name, role, email_verified, phone_verified,
                   profile_photo_url, login_count, last_login_at, created_at, updated_at`,
        [
          input.email.toLowerCase(),
          passwordHash,
          input.full_name,
          input.phone || null,
          input.role
        ]
      );

      const user = result.rows[0];

      // Generate email verification token
      await this.createEmailVerificationToken(user.id, user.email);

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: crypto.randomUUID()
      };

      const tokens = JWTService.generateTokenPair(tokenPayload);

      // Store refresh token
      await this.storeRefreshToken(
        user.id,
        tokens.refreshToken,
        tokens.refreshTokenExpiresAt
      );

      return {
        success: true,
        user,
        tokens
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed',
        errorCode: 'REGISTRATION_ERROR'
      };
    }
  }

  /**
   * Login user
   */
  static async login(input: LoginInput): Promise<AuthResult> {
    try {
      // Get user by email
      const result = await query<User & { password_hash: string; failed_login_attempts: number; account_locked_until: Date | null }>(
        `SELECT id, email, phone, full_name, role, email_verified, phone_verified,
                profile_photo_url, login_count, last_login_at, created_at, updated_at,
                password_hash, failed_login_attempts, account_locked_until
         FROM users
         WHERE email = $1 AND deleted_at IS NULL`,
        [input.email.toLowerCase()]
      );

      // User not found
      if (result.rows.length === 0) {
        await this.logLoginAttempt({
          email_attempted: input.email,
          status: 'FAILED_USER_NOT_FOUND',
          ...input
        });
        return {
          success: false,
          error: 'Invalid email or password',
          errorCode: 'INVALID_CREDENTIALS'
        };
      }

      const user = result.rows[0];

      // Check if account is locked
      if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
        await this.logLoginAttempt({
          user_id: user.id,
          email_attempted: input.email,
          status: 'FAILED_ACCOUNT_LOCKED',
          ...input
        });
        const lockoutRemaining = Math.ceil(
          (new Date(user.account_locked_until).getTime() - Date.now()) / 60000
        );
        return {
          success: false,
          error: `Account is locked. Try again in ${lockoutRemaining} minutes`,
          errorCode: 'ACCOUNT_LOCKED'
        };
      }

      // Verify password
      const passwordValid = await comparePassword(input.password, user.password_hash);

      if (!passwordValid) {
        // Increment failed attempts
        const newFailedAttempts = user.failed_login_attempts + 1;
        const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

        await query(
          `UPDATE users
           SET failed_login_attempts = $1,
               account_locked_until = $2,
               updated_at = NOW()
           WHERE id = $3`,
          [
            newFailedAttempts,
            shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000) : null,
            user.id
          ]
        );

        await this.logLoginAttempt({
          user_id: user.id,
          email_attempted: input.email,
          status: 'FAILED_WRONG_PASSWORD',
          failure_reason: shouldLock
            ? `Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts`
            : `Failed attempt ${newFailedAttempts} of ${MAX_FAILED_ATTEMPTS}`,
          ...input
        });

        return {
          success: false,
          error: shouldLock
            ? `Account locked for ${LOCKOUT_DURATION_MINUTES} minutes due to too many failed attempts`
            : 'Invalid email or password',
          errorCode: passwordValid ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS'
        };
      }

      // Successful login - reset failed attempts and update login info
      const sessionId = crypto.randomUUID();

      await query(
        `UPDATE users
         SET failed_login_attempts = 0,
             account_locked_until = NULL,
             login_count = login_count + 1,
             last_login_at = NOW(),
             updated_at = NOW()
         WHERE id = $1`,
        [user.id]
      );

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId
      };

      const tokens = JWTService.generateTokenPair(tokenPayload);

      // Store refresh token
      await this.storeRefreshToken(
        user.id,
        tokens.refreshToken,
        tokens.refreshTokenExpiresAt,
        input.user_agent,
        input.ip_address,
        input.device_fingerprint
      );

      // Log successful login
      await this.logLoginAttempt({
        user_id: user.id,
        email_attempted: input.email,
        status: 'SUCCESS',
        session_id: sessionId,
        ...input
      });

      // Remove password_hash from returned user
      const { password_hash, failed_login_attempts, account_locked_until, ...safeUser } = user;

      return {
        success: true,
        user: safeUser as User,
        tokens
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed',
        errorCode: 'LOGIN_ERROR'
      };
    }
  }

  /**
   * Logout user - revoke refresh token
   */
  static async logout(
    userId: string,
    refreshToken: string,
    ip_address?: string,
    user_agent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const tokenHash = JWTService.hashToken(refreshToken);

      // Revoke the refresh token
      await query(
        `UPDATE jwt_refresh_tokens
         SET revoked_at = NOW(),
             revoked_reason = 'USER_LOGOUT'
         WHERE user_id = $1 AND token_hash = $2`,
        [userId, tokenHash]
      );

      // Add to Redis blacklist
      const decoded = JWTService.decodeToken(refreshToken);
      if (decoded?.jti) {
        const ttl = decoded.exp ? (decoded.exp * 1000 - Date.now()) : 7 * 24 * 60 * 60 * 1000;
        await tokenBlacklist.add(decoded.jti, ttl);
      }

      // Log logout
      await this.logLoginAttempt({
        user_id: userId,
        status: 'LOGOUT',
        ip_address,
        user_agent
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Revoke all refresh tokens for user
      await query(
        `UPDATE jwt_refresh_tokens
         SET revoked_at = NOW(),
             revoked_reason = 'LOGOUT_ALL_DEVICES'
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [userId]
      );

      return { success: true };
    } catch (error) {
      console.error('Logout all error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<RefreshResult> {
    try {
      // Verify the refresh token
      const verifyResult = JWTService.verifyRefreshToken(refreshToken);

      if (!verifyResult.valid) {
        return {
          success: false,
          error: verifyResult.expired ? 'Refresh token expired' : 'Invalid refresh token'
        };
      }

      const tokenHash = JWTService.hashToken(refreshToken);

      // Check if token exists and is not revoked
      const tokenResult = await query<{ id: string; user_id: string }>(
        `SELECT id, user_id FROM jwt_refresh_tokens
         WHERE token_hash = $1
           AND revoked_at IS NULL
           AND expires_at > NOW()`,
        [tokenHash]
      );

      if (tokenResult.rows.length === 0) {
        return {
          success: false,
          error: 'Refresh token not found or revoked'
        };
      }

      const storedToken = tokenResult.rows[0];

      // Get user data
      const userResult = await query<User>(
        `SELECT id, email, role FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [storedToken.user_id]
      );

      if (userResult.rows.length === 0) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const user = userResult.rows[0];

      // Revoke old refresh token (token rotation)
      await query(
        `UPDATE jwt_refresh_tokens
         SET revoked_at = NOW(),
             revoked_reason = 'TOKEN_ROTATION'
         WHERE id = $1`,
        [storedToken.id]
      );

      // Generate new token pair
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: crypto.randomUUID()
      };

      const tokens = JWTService.generateTokenPair(tokenPayload);

      // Store new refresh token
      await this.storeRefreshToken(
        user.id,
        tokens.refreshToken,
        tokens.refreshTokenExpiresAt
      );

      return {
        success: true,
        tokens
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(
    email: string,
    ip_address?: string,
    user_agent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user
      const result = await query<{ id: string; email: string }>(
        'SELECT id, email FROM users WHERE email = $1 AND deleted_at IS NULL',
        [email.toLowerCase()]
      );

      // Always return success to prevent email enumeration
      if (result.rows.length === 0) {
        return { success: true };
      }

      const user = result.rows[0];

      // Invalidate any existing reset tokens
      await query('SELECT invalidate_user_reset_tokens($1)', [user.id]);

      // Generate reset token
      const resetToken = JWTService.generateSecureToken(32);
      const tokenHash = JWTService.hashToken(resetToken);
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      await query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, tokenHash, expiresAt, ip_address, user_agent]
      );

      // TODO: Send email with reset link containing resetToken
      console.log('Password reset token (for dev):', resetToken);

      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'Failed to process request' };
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      const tokenHash = JWTService.hashToken(token);

      // Find valid token
      const tokenResult = await query<{ id: string; user_id: string }>(
        `SELECT id, user_id FROM password_reset_tokens
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()`,
        [tokenHash]
      );

      if (tokenResult.rows.length === 0) {
        return {
          success: false,
          error: 'Invalid or expired reset token'
        };
      }

      const resetToken = tokenResult.rows[0];

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password in transaction
      await transaction(async (client) => {
        // Update password
        await client.query(
          `UPDATE users
           SET password_hash = $1,
               failed_login_attempts = 0,
               account_locked_until = NULL,
               updated_at = NOW()
           WHERE id = $2`,
          [passwordHash, resetToken.user_id]
        );

        // Mark token as used
        await client.query(
          'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1',
          [resetToken.id]
        );

        // Revoke all refresh tokens (force re-login)
        await client.query(
          `UPDATE jwt_refresh_tokens
           SET revoked_at = NOW(),
               revoked_reason = 'PASSWORD_RESET'
           WHERE user_id = $1 AND revoked_at IS NULL`,
          [resetToken.user_id]
        );
      });

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tokenHash = JWTService.hashToken(token);

      const result = await query(
        `UPDATE email_verification_tokens
         SET verified_at = NOW()
         WHERE token_hash = $1
           AND verified_at IS NULL
           AND expires_at > NOW()
         RETURNING user_id`,
        [tokenHash]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Invalid or expired verification token'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const result = await query<User>(
      `SELECT id, email, phone, full_name, role, email_verified, phone_verified,
              profile_photo_url, login_count, last_login_at, created_at, updated_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Change password (for logged-in users)
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current password hash
      const result = await query<{ password_hash: string }>(
        'SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
        [userId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, result.rows[0].password_hash);
      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password
      const validation = validatePassword(newPassword);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Hash and update
      const passwordHash = await hashPassword(newPassword);
      await query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [passwordHash, userId]
      );

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  // ==================== Private Helper Methods ====================

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static async storeRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
    deviceFingerprint?: string
  ): Promise<void> {
    const tokenHash = JWTService.hashToken(token);

    await query(
      `INSERT INTO jwt_refresh_tokens
       (user_id, token_hash, expires_at, user_agent, ip_address, device_fingerprint)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, tokenHash, expiresAt, userAgent, ipAddress, deviceFingerprint]
    );
  }

  private static async createEmailVerificationToken(
    userId: string,
    email: string
  ): Promise<string> {
    const token = JWTService.generateSecureToken(32);
    const tokenHash = JWTService.hashToken(token);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, email, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, tokenHash, email, expiresAt]
    );

    // TODO: Send verification email
    console.log('Email verification token (for dev):', token);

    return token;
  }

  private static async logLoginAttempt(data: {
    user_id?: string;
    email_attempted?: string;
    ip_address?: string;
    user_agent?: string;
    device_fingerprint?: string;
    status: string;
    failure_reason?: string;
    session_id?: string;
  }): Promise<void> {
    try {
      await query(
        `INSERT INTO login_audit_logs
         (user_id, email_attempted, ip_address, user_agent, device_fingerprint, status, failure_reason, session_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          data.user_id || null,
          data.email_attempted || null,
          data.ip_address || null,
          data.user_agent || null,
          data.device_fingerprint || null,
          data.status,
          data.failure_reason || null,
          data.session_id || null
        ]
      );
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }
  }
}

export default AuthService;
