/**
 * JWT Service - Token Generation and Verification
 * Handles access tokens (15min) and refresh tokens (7 days)
 * 
 * @module utils/jwt
 */

import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import crypto from 'crypto';

// Environment variables with defaults
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY: number = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY: number = 7 * 24 * 60 * 60; // 7 days in seconds
const ISSUER = process.env.JWT_ISSUER || 'houlnd-realty';
const AUDIENCE = process.env.JWT_AUDIENCE || 'houlnd-realty-client';

/**
 * User payload for JWT tokens
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'PROMOTER' | 'ADMIN';
  sessionId?: string;
}

/**
 * Complete decoded token structure
 */
export interface DecodedToken extends TokenPayload, JwtPayload {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  jti: string;
}

/**
 * Token pair returned after successful authentication
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

/**
 * Result of token verification
 */
export interface VerifyResult {
  valid: boolean;
  expired: boolean;
  payload?: DecodedToken;
  error?: string;
}

/**
 * JWT Service class for token operations
 */
export class JWTService {
  /**
   * Generate a unique token ID (jti)
   */
  static generateTokenId(): string {
    return crypto.randomUUID();
  }

  /**
   * Hash a token for secure storage (refresh tokens)
   * Uses SHA-256 for consistent hashing
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate random bytes for secure tokens
   */
  static generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Parse expiry string to milliseconds
   */
  private static parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000; // Default 15 minutes
    
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 15 * 60 * 1000;
    }
  }

  /**
   * Generate access token (short-lived, 15 minutes)
   */
  static generateAccessToken(payload: TokenPayload): string {
    const jti = this.generateTokenId();
    
    const signOptions: SignOptions = {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: ISSUER,
      audience: AUDIENCE,
      jwtid: jti,
      algorithm: 'HS256'
    };

    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        sessionId: payload.sessionId,
        type: 'access'
      },
      ACCESS_TOKEN_SECRET,
      signOptions
    );
  }

  /**
   * Generate refresh token (long-lived, 7 days)
   */
  static generateRefreshToken(payload: TokenPayload): string {
    const jti = this.generateTokenId();
    
    const signOptions: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: ISSUER,
      audience: AUDIENCE,
      jwtid: jti,
      algorithm: 'HS256'
    };

    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        sessionId: payload.sessionId,
        type: 'refresh'
      },
      REFRESH_TOKEN_SECRET,
      signOptions
    );
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000)
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): VerifyResult {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: ISSUER,
        audience: AUDIENCE,
        algorithms: ['HS256']
      };

      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, verifyOptions) as DecodedToken;
      
      if ((decoded as any).type !== 'access') {
        return {
          valid: false,
          expired: false,
          error: 'Invalid token type'
        };
      }

      return {
        valid: true,
        expired: false,
        payload: decoded
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          expired: true,
          error: 'Token expired'
        };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          valid: false,
          expired: false,
          error: error.message
        };
      }
      return {
        valid: false,
        expired: false,
        error: 'Token verification failed'
      };
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): VerifyResult {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: ISSUER,
        audience: AUDIENCE,
        algorithms: ['HS256']
      };

      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, verifyOptions) as DecodedToken;
      
      if ((decoded as any).type !== 'refresh') {
        return {
          valid: false,
          expired: false,
          error: 'Invalid token type'
        };
      }

      return {
        valid: true,
        expired: false,
        payload: decoded
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          expired: true,
          error: 'Token expired'
        };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          valid: false,
          expired: false,
          error: error.message
        };
      }
      return {
        valid: false,
        expired: false,
        error: 'Token verification failed'
      };
    }
  }

  /**
   * Decode token without verification (for inspection)
   */
  static decodeToken(token: string): DecodedToken | null {
    try {
      return jwt.decode(token) as DecodedToken;
    } catch {
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Check if token is about to expire (within threshold)
   */
  static isAboutToExpire(token: string, thresholdMinutes: number = 5): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const threshold = thresholdMinutes * 60 * 1000;
    
    return expiresAt - Date.now() < threshold;
  }

  /**
   * Get remaining time until token expires
   */
  static getTimeToExpiry(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    const expiresAt = decoded.exp * 1000;
    return Math.max(0, expiresAt - Date.now());
  }
}

export default JWTService;
