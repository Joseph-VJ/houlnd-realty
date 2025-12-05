/**
 * Authentication Service (Supabase Version)
 * Handles all authentication-related business logic using Supabase
 * 
 * @module services/AuthService
 */

import { getSupabaseAdmin, TABLES } from '../config/supabase';
import { JWTService, TokenPayload, TokenPair } from '../utils/jwt';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
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
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
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
 * Authentication Service Class (Supabase)
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput): Promise<AuthResult> {
    try {
      const supabase = getSupabaseAdmin();

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
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('email', input.email.toLowerCase())
        .is('deleted_at', null)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered',
          errorCode: 'EMAIL_EXISTS'
        };
      }

      // Check phone if provided
      if (input.phone) {
        const { data: existingPhone } = await supabase
          .from(TABLES.USERS)
          .select('id')
          .eq('phone', input.phone)
          .is('deleted_at', null)
          .single();

        if (existingPhone) {
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
      const { data: user, error: createError } = await supabase
        .from(TABLES.USERS)
        .insert({
          email: input.email.toLowerCase(),
          password_hash: passwordHash,
          full_name: input.full_name,
          phone: input.phone || null,
          role: input.role
        })
        .select('id, email, phone, full_name, role, email_verified, phone_verified, profile_photo_url, login_count, last_login_at, created_at, updated_at')
        .single();

      if (createError || !user) {
        console.error('User creation error:', createError);
        return {
          success: false,
          error: 'Failed to create user',
          errorCode: 'CREATE_ERROR'
        };
      }

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
        user: user as User,
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
      const supabase = getSupabaseAdmin();

      // Get user by email
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('id, email, phone, full_name, role, email_verified, phone_verified, profile_photo_url, login_count, last_login_at, created_at, updated_at, password_hash, failed_login_attempts, account_locked_until')
        .eq('email', input.email.toLowerCase())
        .is('deleted_at', null)
        .single();

      // User not found
      if (error || !user) {
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
        const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
        const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

        await supabase
          .from(TABLES.USERS)
          .update({
            failed_login_attempts: newFailedAttempts,
            account_locked_until: shouldLock
              ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000).toISOString()
              : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

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
          errorCode: shouldLock ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS'
        };
      }

      // Successful login - reset failed attempts and update login info
      const sessionId = crypto.randomUUID();

      await supabase
        .from(TABLES.USERS)
        .update({
          failed_login_attempts: 0,
          account_locked_until: null,
          login_count: (user.login_count || 0) + 1,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

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

      // Remove sensitive fields from returned user
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
      const supabase = getSupabaseAdmin();
      const tokenHash = JWTService.hashToken(refreshToken);

      // Revoke the refresh token
      await supabase
        .from(TABLES.JWT_REFRESH_TOKENS)
        .update({
          revoked_at: new Date().toISOString(),
          revoked_reason: 'USER_LOGOUT'
        })
        .eq('user_id', userId)
        .eq('token_hash', tokenHash);

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
      const supabase = getSupabaseAdmin();

      // Revoke all refresh tokens for user
      await supabase
        .from(TABLES.JWT_REFRESH_TOKENS)
        .update({
          revoked_at: new Date().toISOString(),
          revoked_reason: 'LOGOUT_ALL_DEVICES'
        })
        .eq('user_id', userId)
        .is('revoked_at', null);

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
      const supabase = getSupabaseAdmin();

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
      const { data: storedToken, error } = await supabase
        .from(TABLES.JWT_REFRESH_TOKENS)
        .select('id, user_id')
        .eq('token_hash', tokenHash)
        .is('revoked_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !storedToken) {
        return {
          success: false,
          error: 'Refresh token not found or revoked'
        };
      }

      // Get user data
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('id, email, role')
        .eq('id', storedToken.user_id)
        .is('deleted_at', null)
        .single();

      if (userError || !user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Revoke old refresh token (token rotation)
      await supabase
        .from(TABLES.JWT_REFRESH_TOKENS)
        .update({
          revoked_at: new Date().toISOString(),
          revoked_reason: 'TOKEN_ROTATION'
        })
        .eq('id', storedToken.id);

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
      const supabase = getSupabaseAdmin();

      // Get user
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('id, email')
        .eq('email', email.toLowerCase())
        .is('deleted_at', null)
        .single();

      // Always return success to prevent email enumeration
      if (!user) {
        return { success: true };
      }

      // Invalidate any existing reset tokens
      await supabase
        .from(TABLES.PASSWORD_RESET_TOKENS)
        .update({ used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('used_at', null);

      // Generate reset token
      const resetToken = JWTService.generateSecureToken(32);
      const tokenHash = JWTService.hashToken(resetToken);
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      await supabase
        .from(TABLES.PASSWORD_RESET_TOKENS)
        .insert({
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt.toISOString(),
          ip_address,
          user_agent
        });

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
      const supabase = getSupabaseAdmin();

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
      const { data: resetToken, error } = await supabase
        .from(TABLES.PASSWORD_RESET_TOKENS)
        .select('id, user_id')
        .eq('token_hash', tokenHash)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !resetToken) {
        return {
          success: false,
          error: 'Invalid or expired reset token'
        };
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: passwordHash,
          failed_login_attempts: 0,
          account_locked_until: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resetToken.user_id);

      // Mark token as used
      await supabase
        .from(TABLES.PASSWORD_RESET_TOKENS)
        .update({ used_at: new Date().toISOString() })
        .eq('id', resetToken.id);

      // Revoke all refresh tokens (force re-login)
      await supabase
        .from(TABLES.JWT_REFRESH_TOKENS)
        .update({
          revoked_at: new Date().toISOString(),
          revoked_reason: 'PASSWORD_RESET'
        })
        .eq('user_id', resetToken.user_id)
        .is('revoked_at', null);

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
      const supabase = getSupabaseAdmin();
      const tokenHash = JWTService.hashToken(token);

      // Find and update token
      const { data: verifyToken, error } = await supabase
        .from(TABLES.EMAIL_VERIFICATION_TOKENS)
        .select('id, user_id')
        .eq('token_hash', tokenHash)
        .is('verified_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !verifyToken) {
        return {
          success: false,
          error: 'Invalid or expired verification token'
        };
      }

      // Mark token as verified
      await supabase
        .from(TABLES.EMAIL_VERIFICATION_TOKENS)
        .update({ verified_at: new Date().toISOString() })
        .eq('id', verifyToken.id);

      // Update user as verified
      await supabase
        .from(TABLES.USERS)
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', verifyToken.user_id);

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
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('id, email, phone, full_name, role, email_verified, phone_verified, profile_photo_url, login_count, last_login_at, created_at, updated_at')
        .eq('id', userId)
        .is('deleted_at', null)
        .single();

      if (error || !user) return null;

      return user as User;
    } catch {
      return null;
    }
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
      const supabase = getSupabaseAdmin();

      // Get current password hash
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('password_hash')
        .eq('id', userId)
        .is('deleted_at', null)
        .single();

      if (error || !user) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password_hash);
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
      await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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
    const supabase = getSupabaseAdmin();
    const tokenHash = JWTService.hashToken(token);

    await supabase
      .from(TABLES.JWT_REFRESH_TOKENS)
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        user_agent: userAgent,
        ip_address: ipAddress,
        device_fingerprint: deviceFingerprint
      });
  }

  private static async createEmailVerificationToken(
    userId: string,
    email: string
  ): Promise<string> {
    const supabase = getSupabaseAdmin();
    const token = JWTService.generateSecureToken(32);
    const tokenHash = JWTService.hashToken(token);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await supabase
      .from(TABLES.EMAIL_VERIFICATION_TOKENS)
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        email,
        expires_at: expiresAt.toISOString()
      });

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
      const supabase = getSupabaseAdmin();

      await supabase
        .from(TABLES.LOGIN_AUDIT_LOGS)
        .insert({
          user_id: data.user_id || null,
          email_attempted: data.email_attempted || null,
          ip_address: data.ip_address || null,
          user_agent: data.user_agent || null,
          device_fingerprint: data.device_fingerprint || null,
          status: data.status,
          failure_reason: data.failure_reason || null,
          session_id: data.session_id || null
        });
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }
  }
}

export default AuthService;
