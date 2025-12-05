/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user to request
 * 
 * @module middleware/auth
 */

import { Request, Response, NextFunction } from 'express';
import { JWTService, DecodedToken } from '../utils/jwt';
import { tokenBlacklist } from '../config/redis';
import { AuthService, UserRole } from '../services/AuthService.supabase';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
        sessionId?: string;
      };
      token?: string;
    }
  }
}

/**
 * Authenticate request using JWT access token
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    const token = JWTService.extractFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
        errorCode: 'NO_TOKEN'
      });
      return;
    }

    // Verify token
    const verifyResult = JWTService.verifyAccessToken(token);

    if (!verifyResult.valid) {
      const statusCode = verifyResult.expired ? 401 : 403;
      res.status(statusCode).json({
        success: false,
        error: verifyResult.error || 'Invalid token',
        errorCode: verifyResult.expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
      return;
    }

    // Check if token is blacklisted
    if (verifyResult.payload?.jti) {
      const isBlacklisted = await tokenBlacklist.isBlacklisted(verifyResult.payload.jti);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          error: 'Token has been revoked',
          errorCode: 'TOKEN_REVOKED'
        });
        return;
      }
    }

    // Attach user info to request
    req.user = {
      userId: verifyResult.payload!.userId,
      email: verifyResult.payload!.email,
      role: verifyResult.payload!.role as UserRole,
      sessionId: verifyResult.payload!.sessionId
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      errorCode: 'AUTH_ERROR'
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = JWTService.extractFromHeader(authHeader);

  if (!token) {
    return next();
  }

  const verifyResult = JWTService.verifyAccessToken(token);

  if (verifyResult.valid && verifyResult.payload) {
    req.user = {
      userId: verifyResult.payload.userId,
      email: verifyResult.payload.email,
      role: verifyResult.payload.role as UserRole,
      sessionId: verifyResult.payload.sessionId
    };
    req.token = token;
  }

  next();
}

/**
 * Require specific role(s)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 'NOT_AUTHENTICATED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        errorCode: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
}

/**
 * Require email verification
 */
export async function requireEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      errorCode: 'NOT_AUTHENTICATED'
    });
    return;
  }

  const user = await AuthService.getUserById(req.user.userId);

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'User not found',
      errorCode: 'USER_NOT_FOUND'
    });
    return;
  }

  if (!user.email_verified) {
    res.status(403).json({
      success: false,
      error: 'Email verification required',
      errorCode: 'EMAIL_NOT_VERIFIED'
    });
    return;
  }

  next();
}

/**
 * Require user to be the owner of a resource
 */
export function requireOwnership(getUserId: (req: Request) => string | undefined) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const resourceUserId = getUserId(req);

    if (!resourceUserId) {
      res.status(404).json({
        success: false,
        error: 'Resource not found',
        errorCode: 'NOT_FOUND'
      });
      return;
    }

    // Admins can access any resource
    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.userId !== resourceUserId) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
        errorCode: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
}

/**
 * Check if user can perform action on resource
 */
export function canAccess(
  checkFn: (req: Request) => Promise<boolean>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const allowed = await checkFn(req);

    if (!allowed) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
        errorCode: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
}

export default {
  authenticate,
  optionalAuth,
  requireRole,
  requireEmailVerified,
  requireOwnership,
  canAccess
};
