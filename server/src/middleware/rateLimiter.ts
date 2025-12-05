/**
 * Rate Limiting Middleware
 * Protects endpoints from abuse using Redis-backed sliding window
 * 
 * @module middleware/rateLimiter
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient, isRedisAvailable, rateLimitStore } from '../config/redis';

// Rate limit configurations
export const RATE_LIMITS = {
  // Authentication endpoints (strict)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Password reset (very strict)
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: 'Too many password reset requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // General API endpoints (relaxed)
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests. Please slow down.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Search/query endpoints (moderate)
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: 'Too many search requests. Please slow down.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // File upload endpoints (strict)
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Upload limit reached. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  }
};

/**
 * Create a rate limiter with optional Redis store
 */
async function createLimiter(config: typeof RATE_LIMITS.auth) {
  const redisAvailable = await isRedisAvailable();
  
  if (redisAvailable) {
    const client = await getRedisClient();
    return rateLimit({
      ...config,
      store: new RedisStore({
        // @ts-ignore - Type compatibility issue
        sendCommand: (...args: string[]) => client.sendCommand(args)
      }),
      keyGenerator: (req: Request) => {
        // Use IP + endpoint as key
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        return `${ip}:${req.path}`;
      }
    });
  }
  
  // Fallback to in-memory store
  console.warn('Redis not available, using in-memory rate limiting');
  return rateLimit({
    ...config,
    keyGenerator: (req: Request) => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      return `${ip}:${req.path}`;
    }
  });
}

// Pre-configured limiters
let authLimiter: ReturnType<typeof rateLimit> | null = null;
let passwordResetLimiter: ReturnType<typeof rateLimit> | null = null;
let apiLimiter: ReturnType<typeof rateLimit> | null = null;
let searchLimiter: ReturnType<typeof rateLimit> | null = null;
let uploadLimiter: ReturnType<typeof rateLimit> | null = null;

/**
 * Initialize rate limiters
 */
export async function initializeRateLimiters(): Promise<void> {
  try {
    authLimiter = await createLimiter(RATE_LIMITS.auth);
    passwordResetLimiter = await createLimiter(RATE_LIMITS.passwordReset);
    apiLimiter = await createLimiter(RATE_LIMITS.api);
    searchLimiter = await createLimiter(RATE_LIMITS.search);
    uploadLimiter = await createLimiter(RATE_LIMITS.upload);
    console.log('Rate limiters initialized');
  } catch (error) {
    console.error('Failed to initialize rate limiters:', error);
  }
}

/**
 * Get rate limiter middleware for authentication
 */
export function getAuthLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (authLimiter) {
      return authLimiter(req, res, next);
    }
    next();
  };
}

/**
 * Get rate limiter for password reset
 */
export function getPasswordResetLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (passwordResetLimiter) {
      return passwordResetLimiter(req, res, next);
    }
    next();
  };
}

/**
 * Get general API rate limiter
 */
export function getApiLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (apiLimiter) {
      return apiLimiter(req, res, next);
    }
    next();
  };
}

/**
 * Get search rate limiter
 */
export function getSearchLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (searchLimiter) {
      return searchLimiter(req, res, next);
    }
    next();
  };
}

/**
 * Get upload rate limiter
 */
export function getUploadLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (uploadLimiter) {
      return uploadLimiter(req, res, next);
    }
    next();
  };
}

/**
 * Custom rate limiter for specific scenarios (e.g., per-user limits)
 */
export function createCustomLimiter(options: {
  windowMs: number;
  max: number;
  keyGenerator: (req: Request) => string;
  message?: string;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator(req);
    
    try {
      const { count, resetTime } = await rateLimitStore.increment(key, options.windowMs);
      
      // Set headers
      res.setHeader('X-RateLimit-Limit', options.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
      
      if (count > options.max) {
        return res.status(429).json({
          success: false,
          error: options.message || 'Too many requests',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        });
      }
      
      next();
    } catch (error) {
      // If rate limiting fails, allow request but log warning
      console.warn('Rate limiting error:', error);
      next();
    }
  };
}

/**
 * IP-based blocking for suspicious activity
 */
const blockedIPs = new Set<string>();

export function blockIP(ip: string, durationMs: number = 60 * 60 * 1000): void {
  blockedIPs.add(ip);
  setTimeout(() => blockedIPs.delete(ip), durationMs);
}

export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
}

export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

/**
 * Middleware to check IP blocking
 */
export function ipBlockMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  if (isIPBlocked(ip)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }
  
  next();
}

/**
 * Progressive delay for repeated failed attempts
 */
export function progressiveDelay(attemptCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  return Math.min(Math.pow(2, attemptCount - 1) * 1000, 30000);
}

export default {
  initializeRateLimiters,
  getAuthLimiter,
  getPasswordResetLimiter,
  getApiLimiter,
  getSearchLimiter,
  getUploadLimiter,
  createCustomLimiter,
  blockIP,
  unblockIP,
  isIPBlocked,
  ipBlockMiddleware,
  progressiveDelay,
  RATE_LIMITS
};
